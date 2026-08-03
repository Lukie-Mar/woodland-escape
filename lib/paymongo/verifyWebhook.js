import crypto from "crypto";

export function verifyWebhook(rawBody, signatureHeader) {
  const secret = process.env.PAYMONGO_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error(
      "PAYMONGO_WEBHOOK_SECRET is missing."
    );
  }

  if (!signatureHeader) {
    return false;
  }

  const values = {};

  signatureHeader.split(",").forEach((item) => {
    const [key, value] = item.split("=");

    values[key.trim()] = value.trim();
  });

  const timestamp = values.t;

  // Test mode uses "te"
  const receivedSignature =
    values.te || values.li;

  if (!timestamp || !receivedSignature) {
    return false;
  }

  const payload = `${timestamp}.${rawBody}`;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "hex"),
      Buffer.from(receivedSignature, "hex")
    );
  } catch {
    return false;
  }
}