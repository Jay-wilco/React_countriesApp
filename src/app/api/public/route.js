// create a supabase connected route for a public table called test

import { supabase } from "@/lib/supabase/supabase";

export async function GET(request) {
  const { data, error } = await supabase.from("test").select("*");
  if (error) {
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
