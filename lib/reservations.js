import { supabase } from "./supabase";

/**
 * Create a reservation
 */
export async function createReservation(reservation) {
  const { data, error } = await supabase
    .from("reservations")
    .insert([reservation])
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Get all reservations
 */
export async function getReservations() {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("check_in", { ascending: true });

  if (error) throw error;

  return data;
}

/**
 * Get a reservation by ID
 */
export async function getReservation(id) {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

/**
 * Update reservation
 */
export async function updateReservation(id, values) {
  const { data, error } = await supabase
    .from("reservations")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Delete reservation
 */
export async function deleteReservation(id) {
  const { error } = await supabase
    .from("reservations")
    .delete()
    .eq("id", id);

  if (error) throw error;
}