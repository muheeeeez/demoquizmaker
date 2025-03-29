export default defineNuxtRouteMiddleware((to) => {
  if (process.client && to.path === "/authentication/professor-auth") {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      return navigateTo("/authentication/mobile-professor-auth");
    }
  }
});
