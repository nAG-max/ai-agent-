import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SearchSession, Business, DuplicateRecord, SystemStats } from "../types";

let supabaseClient: SupabaseClient | null = null;

// Lazy initialization of Supabase client
export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = process.env.SUPABASE_URL || "https://ximpkrrgizbrdoefcprr.supabase.co";
  const anonKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpbXBrcnJnaXpicmRvZWZjcHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNzIxNzAsImV4cCI6MjA5Nzg0ODE3MH0.VKDfiaRX5U6Ii7CHDjHgYRBEAKpGEUfs7PXAnHhHCWQ";

  if (!url || !anonKey || url.includes("MY_SUPABASE_URL") || anonKey.includes("MY_SUPABASE_ANON")) {
    console.warn("Supabase credentials not configured correctly in environment.");
    return null;
  }

  try {
    // Standardize URL to exclude rest path if it was pasted
    let cleanUrl = url.trim();
    if (cleanUrl.endsWith("/rest/v1") || cleanUrl.endsWith("/rest/v1/")) {
      cleanUrl = cleanUrl.replace(/\/rest\/v1\/?$/, "");
    }
    supabaseClient = createClient(cleanUrl, anonKey.trim());
    return supabaseClient;
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    return null;
  }
}

export interface SupabaseStatus {
  isConfigured: boolean;
  isConnected: boolean;
  tablesStatus: {
    search_sessions: boolean;
    discovered_businesses: boolean;
    popular_queries: boolean;
    deduplicated_records: boolean;
  };
  error?: string;
}

// Check database connection and see which tables exist
export async function checkSupabaseStatus(): Promise<SupabaseStatus> {
  const client = getSupabaseClient();
  const status: SupabaseStatus = {
    isConfigured: !!client,
    isConnected: false,
    tablesStatus: {
      search_sessions: false,
      discovered_businesses: false,
      popular_queries: false,
      deduplicated_records: false,
    }
  };

  if (!client) {
    return status;
  }

  try {
    // Try querying each table to see if it exists
    const [sessionsRes, businessesRes, popularRes, duplicatesRes] = await Promise.all([
      client.from("search_sessions").select("id").limit(1),
      client.from("discovered_businesses").select("id").limit(1),
      client.from("popular_queries").select("query").limit(1),
      client.from("deduplicated_records").select("id").limit(1),
    ]);

    status.isConnected = true;
    status.tablesStatus.search_sessions = !sessionsRes.error;
    status.tablesStatus.discovered_businesses = !businessesRes.error;
    status.tablesStatus.popular_queries = !popularRes.error;
    status.tablesStatus.deduplicated_records = !duplicatesRes.error;

    if (sessionsRes.error) {
      console.warn("Table search_sessions check failed:", sessionsRes.error.message);
    }
  } catch (err: any) {
    status.error = err?.message || String(err);
    console.error("Supabase status check failed:", err);
  }

  return status;
}

// ----------------------------------------------------
// DB OPERATIONAL APIS (With Silent Fallbacks)
// ----------------------------------------------------

export async function supabaseGetSessions(): Promise<any[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("search_sessions")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.warn("Supabase fetch sessions error:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Supabase get sessions fail:", err);
    return null;
  }
}

export async function supabaseGetSession(id: string): Promise<SearchSession | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data: sessionData, error: sessionError } = await client
      .from("search_sessions")
      .select("*")
      .eq("id", id)
      .single();

    if (sessionError) {
      console.warn("Supabase fetch session error:", sessionError.message);
      return null;
    }

    // Fetch businesses
    const { data: businessesData, error: businessesError } = await client
      .from("discovered_businesses")
      .select("*")
      .eq("session_id", id);

    // Fetch duplicates
    const { data: duplicatesData, error: duplicatesError } = await client
      .from("deduplicated_records")
      .select("*")
      .eq("session_id", id);

    const businesses: Business[] = (businessesData || []).map(b => ({
      id: b.id,
      name: b.name,
      address: b.address || "",
      phone: b.phone || "",
      email: b.email || "",
      website: b.website || "",
      working_hours: b.working_hours || "",
      rating: Number(b.rating) || 0,
      review_count: b.review_count || 0,
      services: b.services || [],
      specialties: b.specialties || [],
      certifications: b.certifications || [],
      awards: b.awards || [],
      image_urls: b.image_urls || [],
      source_urls: b.source_urls || [],
      social_profiles: [], // can be expanded if stored in joined table
      verification: {
        score: b.verification_score || 0,
        confidence: b.verification_confidence || "Low",
        sources: [] // can be queried if tables are populated
      }
    }));

    const duplicates: DuplicateRecord[] = (duplicatesData || []).map(d => ({
      id: d.id,
      name: d.name,
      address: d.address || "",
      phone: d.phone || "",
      website: d.website || "",
      source: d.duplicate_source || "Yelp"
    }));

    // Reconstruct SearchSession
    const session: SearchSession = {
      id: sessionData.id,
      query: sessionData.query,
      category: sessionData.category,
      location: sessionData.location,
      timestamp: sessionData.timestamp,
      status: sessionData.status,
      progress: sessionData.progress,
      results: businesses,
      duplicates: duplicates,
      summary: {
        businessesFound: sessionData.businesses_found || 0,
        businessesVerified: sessionData.businesses_verified || 0,
        duplicatesRemoved: sessionData.duplicates_removed || 0,
        sourcesSearched: ["Google Search", "Yelp", "Bing", "Yellow Pages", "Facebook"],
        durationMs: sessionData.duration_ms || 0,
        quality: {
          websiteCoverage: Number(sessionData.website_coverage) || 0,
          phoneCoverage: Number(sessionData.phone_coverage) || 0,
          hoursCoverage: Number(sessionData.hours_coverage) || 0,
          verificationRate: Number(sessionData.verification_rate) || 0,
        },
        aiReport: sessionData.ai_report || ""
      }
    };

    return session;
  } catch (err) {
    console.error("Supabase get session full error:", err);
    return null;
  }
}

export async function supabaseSaveSession(session: SearchSession): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    // 1. Save main session
    const { error: sessionError } = await client
      .from("search_sessions")
      .upsert({
        id: session.id,
        query: session.query,
        category: session.category,
        location: session.location,
        timestamp: new Date().toISOString(),
        status: session.status,
        progress: session.progress,
        businesses_found: session.summary.businessesFound,
        businesses_verified: session.summary.businessesVerified,
        duplicates_removed: session.summary.duplicatesRemoved,
        duration_ms: session.summary.durationMs,
        website_coverage: session.summary.quality.websiteCoverage,
        phone_coverage: session.summary.quality.phoneCoverage,
        hours_coverage: session.summary.quality.hoursCoverage,
        verification_rate: session.summary.quality.verificationRate,
        ai_report: session.summary.aiReport
      });

    if (sessionError) {
      console.error("Failed to upsert search_session in Supabase:", sessionError.message);
      return false;
    }

    // 2. Save discovered businesses (if any)
    if (session.results && session.results.length > 0) {
      const businessesToInsert = session.results.map(b => ({
        session_id: session.id,
        name: b.name,
        address: b.address,
        phone: b.phone,
        email: b.email,
        website: b.website,
        working_hours: b.working_hours,
        rating: b.rating,
        review_count: b.review_count,
        verification_score: b.verification.score,
        verification_confidence: b.verification.confidence,
        services: b.services,
        specialties: b.specialties,
        certifications: b.certifications,
        awards: b.awards,
        image_urls: b.image_urls,
        source_urls: b.source_urls
      }));

      // Delete existing for this session first to overwrite clean
      await client.from("discovered_businesses").delete().eq("session_id", session.id);
      
      const { error: busError } = await client
        .from("discovered_businesses")
        .insert(businessesToInsert);

      if (busError) {
        console.error("Failed to insert discovered_businesses in Supabase:", busError.message);
      }
    }

    // 3. Save duplicates (if any)
    if (session.duplicates && session.duplicates.length > 0) {
      const dupsToInsert = session.duplicates.map(d => ({
        session_id: session.id,
        name: d.name,
        address: d.address,
        phone: d.phone,
        website: d.website,
        duplicate_source: d.source
      }));

      await client.from("deduplicated_records").delete().eq("session_id", session.id);

      const { error: dupsError } = await client
        .from("deduplicated_records")
        .insert(dupsToInsert);

      if (dupsError) {
        console.error("Failed to insert deduplicated_records in Supabase:", dupsError.message);
      }
    }

    return true;
  } catch (err) {
    console.error("Supabase save session operation failed:", err);
    return false;
  }
}

export async function supabaseGetPopularQueries(): Promise<any[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("popular_queries")
      .select("*")
      .order("count", { ascending: false })
      .limit(10);

    if (error) {
      console.warn("Supabase fetch popular queries error:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Supabase get popular queries fail:", err);
    return null;
  }
}

export async function supabaseIncrementPopularQuery(query: string, category: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    // Check if query exists
    const { data, error } = await client
      .from("popular_queries")
      .select("*")
      .eq("query", query)
      .maybeSingle();

    if (error) {
      console.error("Error looking up popular query:", error);
    }

    if (data) {
      const { error: updateError } = await client
        .from("popular_queries")
        .update({ count: (data.count || 0) + 1, last_searched: new Date().toISOString() })
        .eq("query", query);
      return !updateError;
    } else {
      const { error: insertError } = await client
        .from("popular_queries")
        .insert({
          query,
          category,
          count: 1,
          last_searched: new Date().toISOString()
        });
      return !insertError;
    }
  } catch (err) {
    console.error("Supabase popular query sync fail:", err);
    return false;
  }
}
