import { supabase } from "./supabase";

/**
 * Get blocked dates
 */
export async function getAvailability() {
  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .order("date");

  if (error) throw error;

  return data;
}

/**
 * Block or update a date
 */
export async function saveAvailability(values) {
  const { data, error } = await supabase
    .from("availability")
    .upsert(values, {
      onConflict: "date",
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Remove blocked date
 */
export async function deleteAvailability(date) {
  const { error } = await supabase
    .from("availability")
    .delete()
    .eq("date", date);

  if (error) throw error;
}