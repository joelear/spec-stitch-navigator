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

    const authHeader = req.headers.get("Authorization")!;
    const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace("Bearer ", ""));

    if (!user) {
      throw new Error("Unauthorized");
    }

  if (req.method === "POST") {
    const { code } = await req.json();
    console.log('GitHub auth: Received code:', code);
    console.log('GitHub auth: User ID:', user.id);
    
    // Exchange code for access token
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

    const tokenData = await tokenResponse.json();
    console.log('GitHub auth: Token response:', tokenData);
    
    if (tokenData.error) {
      console.error('GitHub auth: Token error:', tokenData.error_description);
      throw new Error(tokenData.error_description);
    }

    // Get GitHub user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const githubUser = await userResponse.json();
    console.log('GitHub auth: User info:', githubUser);

    // Check if profile exists first
    const { data: existingProfile } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    
    console.log('GitHub auth: Existing profile:', existingProfile);

    let updateData, error;
    
    if (existingProfile) {
      // Update existing profile
      const result = await supabaseClient
        .from("profiles")
        .update({
          github_access_token: tokenData.access_token,
          github_username: githubUser.login,
          github_connected_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select();
      
      updateData = result.data;
      error = result.error;
    } else {
      // Create new profile
      const result = await supabaseClient
        .from("profiles")
        .insert({
          user_id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name,
          github_access_token: tokenData.access_token,
          github_username: githubUser.login,
          github_connected_at: new Date().toISOString(),
        })
        .select();
      
      updateData = result.data;
      error = result.error;
    }

    console.log('GitHub auth: Profile update/insert result:', { updateData, error });

    if (error) {
      console.error('GitHub auth: Database operation error:', error);
      throw error;
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
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});