import { supabase } from "./supabase";

/**
 * Save payment
 */
export async function createPayment(payment) {
  const { data, error } = await supabase
    .from("payments")
    .insert([payment])
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Payment history
 */
export async function getPayments() {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data;
}

/**
 * Payments of one reservation
 */
export async function getReservationPayments(reservationId) {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("reservation_id", reservationId);

  if (error) throw error;

  return data;
}