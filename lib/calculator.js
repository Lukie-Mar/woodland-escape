export function calculateReservation(settings, guests, paymentOption) {
  const packagePrice = settings.package_price;
  const includedGuests = settings.included_guests;
  const extraGuestFee = settings.extra_guest_fee;
  const downPayment = settings.down_payment;

  const extraGuests = Math.max(
    guests - includedGuests,
    0
  );

  const extraFee = extraGuests * extraGuestFee;

  const totalAmount =
    packagePrice + extraFee;

  let amountToPay;

  if (paymentOption === "FULL_PAYMENT") {
    amountToPay = totalAmount;
  } else {
    amountToPay = downPayment;
  }

  return {
    packagePrice,
    includedGuests,
    extraGuests,
    extraFee,
    totalAmount,
    amountToPay,
    remainingBalance:
      totalAmount - amountToPay,
  };
}