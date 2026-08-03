import { supabaseAdmin } from "./supabaseAdmin";

export async function getPaymentSettings() {
  const { data, error } = await supabaseAdmin
    .from("payment_settings")
    .select("*")
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    throw new Error(
      "Payment settings record is missing. Please create one in the payment_settings table."
    );
  }

  return data;
}