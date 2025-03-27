<template>
  <div>Hii welcome too student dashboard</div>
  <div class="navbar-container" @click="logout">
    <img src="/public/images/logout.png" alt="Logout Icon" />
    <p class="logout">{{ isLoggingOut ? "Logging out..." : "Logout" }}</p>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { useAuthStore } from "~/stores/auth";
const router = useRouter();
const $toast = toast;
const isLoggingOut = ref(false);
const authStore = useAuthStore();

const logout = async () => {
  if (!confirm("Are you sure you want to logout?")) return;

  isLoggingOut.value = true;
  try {
    await $fetch("https://genertia-quizmakerbackend.onrender.com/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    $toast.success("You have been logged out successfully.");
    authStore.logout();
    router.push("/");
  } catch (error) {
    $toast.error("An error occurred during logout.");
    console.error(error);
  } finally {
    isLoggingOut.value = false;
  }
};
</script>
