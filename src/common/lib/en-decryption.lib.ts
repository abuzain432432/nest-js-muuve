import * as crypto from "crypto";

export const createHashVerifier = (token: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return hashedToken;
};
