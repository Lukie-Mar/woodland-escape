import crypto from "crypto";

export function verifyPaymongoWebhook(
  rawBody,
  signatureHeader,
  secret,
  isLive = false
) {
  if (!signatureHeader) {
    return false;
  }

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((item) => {
      const [key, value] = item.split("=");
      return [key.trim(), value];
    })
  );

  const timestamp = parts.t;
  const receivedSignature = isLive
    ? parts.li
    : parts.te;

  if (!timestamp || !receivedSignature) {
    return false;
  }

  const payload = `${timestamp}.${rawBody}`;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(receivedSignature)
  );
}