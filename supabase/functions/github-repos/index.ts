import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { 
      status: 200, 
      headers: corsHeaders 
    });
  }

  try {
    console.log('=== GITHUB REPOS FUNCTION START ===');
    console.log('Request method:', req.method);
    
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

    const authHeader = req.headers.get("Authorization");
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace("Bearer ", ""));
    
    console.log('User fetch result:', {
      userId: user?.id,
      userError: userError?.message
    });

    if (!user) {
      throw new Error("Unauthorized");
    }

    console.log('Parsing request body...');
    const { action, repository } = await req.json();
    console.log('Action requested:', action);

    // Get user's GitHub access token
    console.log('Fetching user profile with GitHub token...');
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("github_access_token")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    console.log('Profile fetch result:', {
      hasProfile: !!profile,
      hasToken: !!profile?.github_access_token,
      profileError: profileError?.message
    });

    if (!profile?.github_access_token) {
      throw new Error("GitHub not connected");
    }

    if (action === "list") {
      console.log('Fetching repositories from GitHub API...');
      // Get user's GitHub repositories
      const reposResponse = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
        headers: {
          Authorization: `Bearer ${profile.github_access_token}`,
          "User-Agent": "SpecStitch/1.0",
        },
      });

      console.log('GitHub API response status:', reposResponse.status);
      
      if (!reposResponse.ok) {
        const errorText = await reposResponse.text();
        console.error('GitHub API error:', errorText);
        throw new Error(`GitHub API error: ${reposResponse.status} - ${errorText}`);
      }

      const repositories = await reposResponse.json();
      console.log('Repositories fetched:', {
        count: repositories.length,
        sampleRepo: repositories[0]?.full_name
      });

      return new Response(
        JSON.stringify({ repositories }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "connect") {
      // Store repository connection in database
      const { error } = await supabaseClient
        .from("github_repositories")
        .upsert({
          user_id: user.id,
          github_id: repository.id,
          name: repository.name,
          full_name: repository.full_name,
          description: repository.description,
          private: repository.private,
          html_url: repository.html_url,
          clone_url: repository.clone_url,
          language: repository.language,
          stars_count: repository.stargazers_count,
          forks_count: repository.forks_count,
          default_branch: repository.default_branch,
          is_connected: true,
          connected_at: new Date().toISOString(),
        });

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});