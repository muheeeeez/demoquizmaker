import { useAuthStore } from "~/stores/auth";
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  if (authStore.isLoggedIn && to.path.startsWith("/authentication")) {
    const role = authStore.user?.role?.toLowerCase();
    if (role === "professor") {
      console.log("User:", authStore.user);

      return navigateTo("/professor/professor-dashboard");
    } else {
      console.log("User:", authStore.user);
      return navigateTo("/student/student-dashboard");
    }
  }
});
