// Helper function to check if a token is expired
export function isTokenExpired(token) {
  const payload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  return payload.exp * 1000 < Date.now();
}
