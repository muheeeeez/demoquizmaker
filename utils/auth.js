import * as jwtDecodeModule from "jwt-decode";

const jwtDecode = jwtDecodeModule.default
  ? jwtDecodeModule.default
  : jwtDecodeModule;

export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 < Date.now();
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
}
