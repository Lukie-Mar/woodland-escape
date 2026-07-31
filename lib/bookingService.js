import { supabase } from "./supabase";

export async function createReservation(reservation) {
  const { data, error } = await supabase
    .from("reservations")
    .insert([
      {
        full_name: reservation.fullName,
        contact: reservation.contact,
        email: reservation.email,
        special_request: reservation.specialRequest,
        check_in: reservation.checkIn,
        check_out: reservation.checkOut,
        guests: reservation.guests,
        total: reservation.total,
        status: "Pending",
      },
    ])
    .select();

  if (error) {
    throw error;
  }

  return data;
}