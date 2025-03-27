import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: "",
    refreshToken: "",
    user: null,
  }),
  getters: {
    isLoggedIn(state) {
      return !!state.accessToken;
    },
  },
  actions: {
    
    initializeStore() {
      if (typeof window !== "undefined") {
        const savedAccessToken = localStorage.getItem("access_token");
        const savedRefreshToken = localStorage.getItem("refresh_token");
        const savedUser = localStorage.getItem("user");
        if (savedAccessToken) this.accessToken = savedAccessToken;
        if (savedRefreshToken) this.refreshToken = savedRefreshToken;
        if (savedUser) {
          try {
            this.user = JSON.parse(savedUser);
          } catch (e) {
            console.error("Error parsing user data from localStorage", e);
          }
        }
      }
    },
    setAuth(authData) {
      this.accessToken = authData.access_token;
      this.refreshToken = authData.refresh_token;
      this.user = authData.user;
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", authData.access_token);
        localStorage.setItem("refresh_token", authData.refresh_token);
        localStorage.setItem("user", JSON.stringify(authData.user));
      }
    },
    logout() {
      this.accessToken = "";
      this.refreshToken = "";
      this.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      }
    },
  },
});
