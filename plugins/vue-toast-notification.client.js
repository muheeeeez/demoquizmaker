import { defineNuxtPlugin } from "#app";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-bootstrap.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueToast, {
    position: "top",
    duration: 5000,
    dismissible: true,
  });
});
