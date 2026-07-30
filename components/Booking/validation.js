export function validateReservation(formData) {
  const errors = {};

  if (!formData.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!/^09\d{9}$/.test(formData.contact)) {
    errors.contact =
      "Please enter a valid Philippine mobile number.";
  }

  if (
    formData.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  ) {
    errors.email = "Invalid email address.";
  }

  if (formData.guests < 1) {
    errors.guests = "At least one guest is required.";
  }

  return errors;
}