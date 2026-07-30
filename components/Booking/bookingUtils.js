export function formatDate(date) {
  return date.toISOString().split("T")[0];
}

export function formatPeso(amount) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}