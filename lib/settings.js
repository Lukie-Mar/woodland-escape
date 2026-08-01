import { supabaseAdmin } from "./supabaseAdmin";

export async function getPaymentSettings() {
  const { data, error } = await supabaseAdmin
    .from("payment_settings")
    .select("*")
    .single();

  if (error) throw error;

  return data;
}