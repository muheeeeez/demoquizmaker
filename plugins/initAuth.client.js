import { useAuthStore } from "~/stores";

export default defineNuxtPlugin(() => {
  if (process.client) {
    const authStore = useAuthStore();
    authStore.initializeStore();
  }
});
