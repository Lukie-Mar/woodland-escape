import { revalidatePath } from "next/cache";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import styles from "./Settings.module.css";

async function saveSettings(formData) {
  "use server";

  const packagePrice = Number(
    formData.get("package_price")
  );

  const includedGuests = Number(
    formData.get("included_guests")
  );

  const extraGuestFee = Number(
    formData.get("extra_guest_fee")
  );

  const downPayment = Number(
    formData.get("down_payment")
  );

  const checkInTime = formData.get("check_in_time");
  const checkOutTime = formData.get("check_out_time");
  const resortName = formData.get("resort_name");

  if (
    !Number.isFinite(packagePrice) ||
    !Number.isFinite(includedGuests) ||
    !Number.isFinite(extraGuestFee) ||
    !Number.isFinite(downPayment)
  ) {
    throw new Error("Please enter valid numeric values.");
  }

  if (
    packagePrice < 0 ||
    includedGuests < 1 ||
    extraGuestFee < 0 ||
    downPayment < 0
  ) {
    throw new Error("Please enter valid settings values.");
  }

  const { error } = await supabaseAdmin
    .from("payment_settings")
    .update({
      package_price: packagePrice,
      included_guests: includedGuests,
      extra_guest_fee: extraGuestFee,
      down_payment: downPayment,
      check_in_time: checkInTime,
      check_out_time: checkOutTime,
      resort_name: resortName,
    })
    .eq("id", 1);

  if (error) {
    throw new Error(error.message);
  }

  /*
   * Refresh pages that use these settings.
   */
  revalidatePath("/admin/settings");
  revalidatePath("/admin");
  revalidatePath("/admin/reservations");
}
  
export default async function SettingsPage() {
  const { data: settings, error } = await supabaseAdmin
    .from("payment_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !settings) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Unable to load settings</h2>

          <p>
            {error?.message ||
              "Payment settings record was not found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Settings</h1>

          <p>
            Manage Woodland Escape booking and payment
            settings
          </p>
        </div>
      </div>

      <form action={saveSettings}>
        {/* Resort Settings */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Resort Information</h2>

              <p>
                Basic information used by the reservation
                system.
              </p>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label htmlFor="resort_name">
                Resort Name
              </label>

              <input
                id="resort_name"
                name="resort_name"
                type="text"
                defaultValue={
                  settings.resort_name || ""
                }
                required
              />

              <small>
                Name displayed throughout the booking
                system.
              </small>
            </div>
          </div>
        </section>

        {/* Booking Settings */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Booking Settings</h2>

              <p>
                Configure the basic rules for overnight
                reservations.
              </p>
            </div>
          </div>

          <div className={styles.formGrid}>
            {/* Package Price */}
            <div className={styles.field}>
              <label htmlFor="package_price">
                Package Price
              </label>

              <div className={styles.inputGroup}>
                <span>₱</span>

                <input
                  id="package_price"
                  name="package_price"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={
                    settings.package_price
                  }
                  required
                />
              </div>

              <small>
                Base overnight package price.
              </small>
            </div>

            {/* Included Guests */}
            <div className={styles.field}>
              <label htmlFor="included_guests">
                Included Guests
              </label>

              <input
                id="included_guests"
                name="included_guests"
                type="number"
                min="1"
                step="1"
                defaultValue={
                  settings.included_guests
                }
                required
              />

              <small>
                Number of guests included in the
                package.
              </small>
            </div>

            {/* Extra Guest Fee */}
            <div className={styles.field}>
              <label htmlFor="extra_guest_fee">
                Extra Guest Fee
              </label>

              <div className={styles.inputGroup}>
                <span>₱</span>

                <input
                  id="extra_guest_fee"
                  name="extra_guest_fee"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={
                    settings.extra_guest_fee
                  }
                  required
                />
              </div>

              <small>
                Additional cost for every guest beyond
                the included number.
              </small>
            </div>

            {/* Down Payment */}
            <div className={styles.field}>
              <label htmlFor="down_payment">
                Required Down Payment
              </label>

              <div className={styles.inputGroup}>
                <span>₱</span>

                <input
                  id="down_payment"
                  name="down_payment"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={
                    settings.down_payment
                  }
                  required
                />
              </div>

              <small>
                Amount required for a down-payment
                reservation.
              </small>
            </div>
          </div>
        </section>

        {/* Schedule */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Schedule</h2>

              <p>
                Set the standard check-in and check-out
                times.
              </p>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label htmlFor="check_in_time">
                Check-in Time
              </label>

              <input
                id="check_in_time"
                name="check_in_time"
                type="text"
                defaultValue={
                  settings.check_in_time || ""
                }
                required
              />

              <small>
                Example: 2:00 PM
              </small>
            </div>

            <div className={styles.field}>
              <label htmlFor="check_out_time">
                Check-out Time
              </label>

              <input
                id="check_out_time"
                name="check_out_time"
                type="text"
                defaultValue={
                  settings.check_out_time || ""
                }
                required
              />

              <small>
                Example: 12:00 PM
              </small>
            </div>
          </div>
        </section>

        {/* Save */}
        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.saveButton}
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}