import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log('=== GITHUB REPOS FUNCTION STARTED v2 ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log('Handling CORS preflight');
    return new Response("ok", { 
      status: 200, 
      headers: corsHeaders 
    });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get auth token from request
    const authHeader = req.headers.get("Authorization");
    console.log('Auth header exists:', !!authHeader);
    
    if (!authHeader) {
      console.error('No authorization header');
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Authenticate user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    console.log('Auth result:', {
      hasUser: !!user,
      userId: user?.id,
      authError: authError?.message
    });

    if (authError || !user) {
      console.error('Authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: "Authentication failed" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const requestBody = await req.json();
    const { action, repository } = requestBody;
    console.log('Request action:', action);

    // Get GitHub access token from profiles table
    console.log('Fetching GitHub token for user:', user.id);
    const { data: profiles, error: profileError } = await supabaseClient
      .from("profiles")
      .select("github_access_token, github_username")
      .eq("user_id", user.id)
      .maybeSingle();

    console.log('Profile query result:', {
      hasProfile: !!profiles,
      hasToken: !!profiles?.github_access_token,
      username: profiles?.github_username,
      error: profileError?.message
    });

    if (!profiles?.github_access_token) {
      console.error('No GitHub access token found');
      return new Response(
        JSON.stringify({ error: "GitHub not connected" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "list") {
      console.log('Fetching repositories from GitHub...');
      
      const githubResponse = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
        headers: {
          Authorization: `Bearer ${profiles.github_access_token}`,
          "User-Agent": "SpecGraph/1.0",
          "Accept": "application/vnd.github.v3+json"
        },
      });

      console.log('GitHub API status:', githubResponse.status);

      if (!githubResponse.ok) {
        const errorText = await githubResponse.text();
        console.error('GitHub API error:', {
          status: githubResponse.status,
          statusText: githubResponse.statusText,
          error: errorText
        });
        return new Response(
          JSON.stringify({ error: `GitHub API error: ${githubResponse.status}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const repositories = await githubResponse.json();
      console.log('Successfully fetched', repositories.length, 'repositories');

      return new Response(
        JSON.stringify({ repositories }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "connect") {
      console.log('Connecting repository:', repository?.full_name);
      
      if (!repository) {
        return new Response(
          JSON.stringify({ error: "Repository data required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Store repository in database
      const { error: insertError } = await supabaseClient
        .from("github_repositories")
        .upsert({
          user_id: user.id,
          github_id: repository.id,
          name: repository.name,
          full_name: repository.full_name,
          description: repository.description || null,
          private: repository.private || false,
          html_url: repository.html_url,
          clone_url: repository.clone_url,
          language: repository.language || null,
          stars_count: repository.stargazers_count || 0,
          forks_count: repository.forks_count || 0,
          default_branch: repository.default_branch || "main",
          is_connected: true,
          connected_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Database insert error:', insertError);
        return new Response(
          JSON.stringify({ error: "Failed to save repository" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log('Repository connected successfully');
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Unknown action
    console.error('Unknown action:', action);
    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Function error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Internal server error",
        details: error.name || "UnknownError"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});