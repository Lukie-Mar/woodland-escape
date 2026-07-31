export async function isDateAvailable(date) {

  const { data, error } = await supabase
    .from("reservations")
    .select("id")
    .eq("check_in", date)
    .in("reservation_status", [
      "Pending",
      "Confirmed",
      "Checked In",
    ]);

  if (error) throw error;

  if (data.length > 0)
    return false;

  const blocked = await supabase
    .from("availability")
    .select("id")
    .eq("date", date)
    .eq("status", "blocked");

  if (blocked.error)
    throw blocked.error;

  return blocked.data.length === 0;

}