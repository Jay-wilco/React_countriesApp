// create a supabase connected route for a public table called test

import { supabase } from "@/lib/supabase/supabase";

export async function GET(request) {
  const { data, error } = await supabase.from("test").select("*");
  if (error) {
    console.log(error);
  }
  console.log("Data: ", data);

  return new Response(JSON.stringify(data), { status: 200 });
}
