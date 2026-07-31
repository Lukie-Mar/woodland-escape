import { supabase } from "./supabase";

export async function testConnection() {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Supabase Error:", error);
    return;
  }

  console.log("Connected Successfully!");
  console.log(data);
}