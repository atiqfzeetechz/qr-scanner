import CryptoJS from "crypto-js";

const SECRET_KEY = "MY_SUPER_SECRET_KEY"; // env me rakhna better

export function encodeData(data:any) {
  const json = JSON.stringify(data);

  const encrypted = CryptoJS.AES.encrypt(json, SECRET_KEY).toString();

  // URL-safe banane ke liye
  return encodeURIComponent(encrypted);
}

export function decodeData(encodedToken:string) {
  const cipherText = decodeURIComponent(encodedToken);

  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);

  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  if (!decrypted) {
    throw new Error("Invalid token");
  }

  return JSON.parse(decrypted);
}