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
    console.log('=== GITHUB CONNECT FUNCTION START ===');
    console.log('Request method:', req.method);
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const githubClientId = Deno.env.get("GITHUB_CLIENT_ID");
    const githubClientSecret = Deno.env.get("GITHUB_CLIENT_SECRET");

    console.log('Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasAnonKey: !!anonKey,
      hasServiceKey: !!serviceKey,
      hasGithubClientId: !!githubClientId,
      hasGithubSecret: !!githubClientSecret
    });

    if (!supabaseUrl || !anonKey || !serviceKey || !githubClientId || !githubClientSecret) {
      throw new Error("Missing environment variables.");
    }
    
    // Create Supabase client and get user
    const supabaseClient = createClient(supabaseUrl, anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const authHeader = req.headers.get("Authorization");
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace("Bearer ", ""));
    
    console.log('User fetch result:', {
      userId: user?.id,
      userEmail: user?.email,
      userError: userError?.message
    });
    
    if (userError) throw userError;
    if (!user) throw new Error("Authentication failed: User not found");

    if (req.method === "POST") {
      // Get code from body using req.json()
      console.log('Parsing request body...');
      const { code } = await req.json();
      console.log('Received code:', !!code, code ? `${code.substring(0, 10)}...` : 'null');
      
      if (!code) {
        throw new Error("No OAuth code provided in request body.");
      }

      // Exchange code for access token with GitHub
      console.log('Exchanging code for GitHub token...');
      const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: githubClientId,
          client_secret: githubClientSecret,
          code,
        }),
      });

      console.log('Token response status:', tokenResponse.status);
      
      if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.error('GitHub token exchange failed:', errorText);
          throw new Error(`GitHub token exchange failed: ${errorText}`);
      }
      
      const tokenData = await tokenResponse.json();
      console.log('Token data received:', {
        hasAccessToken: !!tokenData.access_token,
        hasError: !!tokenData.error,
        error: tokenData.error
      });
      
      if (tokenData.error) {
          console.error('GitHub token error:', tokenData.error_description);
          throw new Error(`GitHub token error: ${tokenData.error_description}`);
      }
      
      const accessToken = tokenData.access_token;
      if (!accessToken) {
          throw new Error("No access token received from GitHub.");
      }

      // Fetch GitHub user info
      console.log('Fetching GitHub user info...');
      const userResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "SpecStitch/1.0",
        },
      });

      console.log('GitHub user response status:', userResponse.status);
      
      if (!userResponse.ok) {
          const errorText = await userResponse.text();
          console.error('GitHub API request failed:', errorText);
          throw new Error(`GitHub API request failed: ${errorText}`);
      }
      
      const githubUser = await userResponse.json();
      console.log('GitHub user info:', {
        login: githubUser.login,
        id: githubUser.id,
        hasError: !!githubUser.message
      });
      
      if (githubUser.message) {
          console.error('GitHub API error:', githubUser.message);
          throw new Error(`GitHub API error: ${githubUser.message}`);
      }

      // Update profile in Supabase using admin client
      console.log('Updating profile in database...');
      const adminClient = createClient(supabaseUrl, serviceKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
      });

      const { error: updateError } = await adminClient
        .from("profiles")
        .update({
          github_access_token: accessToken,
          github_username: githubUser.login,
          github_connected_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      console.log('Database update result:', {
        success: !updateError,
        error: updateError?.message
      });

      if (updateError) {
        console.error('DB Update Error:', updateError);
        throw new Error(`Database update failed: ${updateError.message}`);
      }

      console.log('GitHub connection successful, returning response');
      return new Response(JSON.stringify({ success: true, username: githubUser.login }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });

  } catch (error) {
    console.error('=== GITHUB CONNECT ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message, 
      details: error.stack 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});