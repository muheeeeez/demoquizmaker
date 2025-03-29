export default defineNuxtRouteMiddleware((to) => {
  if (process.client && to.path === "/authentication/student-auth") {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      return navigateTo("/authentication/mobile-student-auth");
    }
  }
});
