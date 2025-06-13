import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log('=== GITHUB AUTH FUNCTION START ===');
    console.log('Request method:', req.method);
    
    // Environment check
    const envCheck = {
      hasSupabaseUrl: !!Deno.env.get("SUPABASE_URL"),
      hasAnonKey: !!Deno.env.get("SUPABASE_ANON_KEY"),
      hasServiceKey: !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
      hasGithubClientId: !!Deno.env.get("GITHUB_CLIENT_ID"),
      hasGithubSecret: !!Deno.env.get("GITHUB_CLIENT_SECRET")
    };
    console.log('Environment check:', envCheck);

    if (!envCheck.hasGithubClientId || !envCheck.hasGithubSecret) {
      console.error('Missing GitHub credentials');
      throw new Error("Missing GitHub credentials");
    }

    // Create Supabase clients
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

    // Create admin client for database operations
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
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

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    console.log('User fetch result:', {
      userId: user?.id,
      userEmail: user?.email,
      userError: userError?.message
    });

    if (!user) {
      throw new Error(`Authentication failed: ${userError?.message || 'No user found'}`);
    }

    if (req.method === "POST") {
      const { code } = await req.json();
      console.log('GitHub auth: Received code:', !!code, code ? `${code.substring(0, 10)}...` : 'null');
      console.log('GitHub auth: User ID:', user.id);

      if (!code) {
        throw new Error("No OAuth code provided");
      }
      
      // Exchange code for access token
      console.log('Exchanging OAuth code for token...');
      const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: Deno.env.get("GITHUB_CLIENT_ID"),
          client_secret: Deno.env.get("GITHUB_CLIENT_SECRET"),
          code,
        }),
      });

      console.log('Token response status:', tokenResponse.status);

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('GitHub token request failed:', errorText);
        throw new Error(`GitHub token request failed: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      console.log('GitHub auth: Token response:', {
        hasAccessToken: !!tokenData.access_token,
        hasError: !!tokenData.error,
        error: tokenData.error
      });
      
      if (tokenData.error) {
        console.error('GitHub auth: Token error:', tokenData.error_description);
        throw new Error(tokenData.error_description);
      }

      if (!tokenData.access_token) {
        throw new Error("No access token received from GitHub");
      }

      // Get GitHub user info
      console.log('Fetching GitHub user info...');
      const userResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "User-Agent": "SpecStitch/1.0",
        },
      });

      console.log('GitHub user response status:', userResponse.status);

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        console.error('GitHub API request failed:', errorText);
        throw new Error(`GitHub API request failed: ${userResponse.status}`);
      }

      const githubUser = await userResponse.json();
      console.log('GitHub auth: User info:', {
        login: githubUser.login,
        id: githubUser.id,
        hasError: !!githubUser.message
      });

      if (githubUser.message) {
        throw new Error(`GitHub API error: ${githubUser.message}`);
      }

      // Check if profile exists first (using admin client for better access)
      console.log('Checking for existing profile...');
      const { data: existingProfile, error: fetchError } = await adminClient
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      console.log('GitHub auth: Existing profile check:', {
        profileExists: !!existingProfile,
        fetchError: fetchError?.message
      });

      const profileData = {
        github_access_token: tokenData.access_token,
        github_username: githubUser.login,
        github_connected_at: new Date().toISOString(),
      };

      let result;
      
      if (existingProfile) {
        // Update existing profile using admin client
        console.log('Updating existing profile...');
        result = await adminClient
          .from("profiles")
          .update(profileData)
          .eq("user_id", user.id)
          .select();
      } else {
        // Create new profile using admin client
        console.log('Creating new profile...');
        result = await adminClient
          .from("profiles")
          .insert({
            user_id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name,
            ...profileData
          })
          .select();
      }

      console.log('GitHub auth: Database operation result:', {
        success: !!result.data,
        error: result.error?.message,
        errorDetails: result.error?.details,
        errorHint: result.error?.hint,
        dataLength: result.data?.length
      });

      if (result.error) {
        console.error('GitHub auth: Database operation error:', result.error);
        throw new Error(`Database error: ${result.error.message}`);
      }

      console.log('GitHub auth: Success, returning username:', githubUser.login);
      return new Response(
        JSON.stringify({ 
          success: true, 
          username: githubUser.login 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('=== GITHUB AUTH ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});