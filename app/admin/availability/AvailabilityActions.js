"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const VALID_REASONS = [
  "EXISTING_BOOKING",
  "PRIVATE_EVENT",
  "MAINTENANCE",
];

export async function blockAvailabilityDate(
  date,
  reason
) {
  if (!date) {
    throw new Error("Date is required.");
  }

  if (!VALID_REASONS.includes(reason)) {
    throw new Error("Invalid availability reason.");
  }

  const { error } = await supabaseAdmin
    .from("availability_overrides")
    .upsert(
      {
        date,
        status: "UNAVAILABLE",
        reason,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "date",
      }
    );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/availability");
  revalidatePath("/");

  return { success: true };
}

export async function makeAvailabilityDateAvailable(
  date
) {
  if (!date) {
    throw new Error("Date is required.");
  }

  const { error } = await supabaseAdmin
    .from("availability_overrides")
    .delete()
    .eq("date", date);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/availability");
  revalidatePath("/");

  return { success: true };
}