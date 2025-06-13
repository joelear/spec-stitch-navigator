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

    const { action, repository } = await req.json();

    // Get user's GitHub access token
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("github_access_token")
      .eq("user_id", user.id)
      .single();

    if (!profile?.github_access_token) {
      throw new Error("GitHub not connected");
    }

    if (action === "list") {
      // Get user's GitHub repositories
      const reposResponse = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
        headers: {
          Authorization: `Bearer ${profile.github_access_token}`,
          "User-Agent": "Supabase-Function",
        },
      });

      const repositories = await reposResponse.json();

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