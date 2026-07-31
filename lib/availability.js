import { supabase } from "./supabase";

export async function getAvailability() {
  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .order("date");

  if (error) throw error;

  return data;
}

export async function saveAvailability(payload) {
  const { data, error } = await supabase
    .from("availability")
    .upsert(payload, {
      onConflict: "date",
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function removeAvailability(date) {
  const { error } = await supabase
    .from("availability")
    .delete()
    .eq("date", date);

  if (error) throw error;
}