import { supabase } from "./supabase";

export async function getPaymentSettings() {
  const { data, error } = await supabase
    .from("payment_settings")
    .select("*")
    .single();

  if (error) throw error;

  return data;
}