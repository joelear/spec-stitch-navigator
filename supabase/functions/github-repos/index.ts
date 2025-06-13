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

    // Get user's GitHub token
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("github_access_token")
      .eq("user_id", user.id)
      .single();

    if (!profile?.github_access_token) {
      throw new Error("GitHub not connected");
    }

    if (req.method === "GET") {
      // Fetch repositories from GitHub API
      const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
        headers: {
          Authorization: `Bearer ${profile.github_access_token}`,
          "User-Agent": "SpecGraph-App",
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const repos = await response.json();

      // Store repositories in our database
      for (const repo of repos) {
        await supabaseClient
          .from("github_repositories")
          .upsert({
            user_id: user.id,
            github_id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            html_url: repo.html_url,
            clone_url: repo.clone_url,
            default_branch: repo.default_branch || "main",
            private: repo.private,
            language: repo.language,
            stars_count: repo.stargazers_count,
            forks_count: repo.forks_count,
          }, {
            onConflict: "user_id,github_id"
          });
      }

      return new Response(
        JSON.stringify({ repositories: repos }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === "POST") {
      const { repoId, action } = await req.json();

      if (action === "connect") {
        // Mark repository as connected
        const { error } = await supabaseClient
          .from("github_repositories")
          .update({
            is_connected: true,
            connected_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          .eq("github_id", repoId);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (action === "disconnect") {
        // Mark repository as disconnected
        const { error } = await supabaseClient
          .from("github_repositories")
          .update({
            is_connected: false,
            connected_at: null,
          })
          .eq("user_id", user.id)
          .eq("github_id", repoId);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
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