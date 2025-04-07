<template>
  <div class="info">
    <div class="container" ref="containerRef" id="container">
      <div class="form-container sign-up-container">
        <form @submit.prevent="handleRegister">
          <h1>Create Account</h1>
          <div class="infield">
            <input v-model="firstName" type="text" placeholder="First Name" />
            <label></label>
          </div>
          <div class="infield">
            <input v-model="lastName" type="text" placeholder="Last Name" />
            <label></label>
          </div>
          <div class="infield">
            <input v-model="emailRegister" type="email" placeholder="Email" />
            <label></label>
          </div>
          <div class="infield">
            <input
              v-model="passwordRegister"
              type="password"
              placeholder="Password"
            />
            <label></label>
          </div>
          <div class="infield">
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm Password"
            />
            <label></label>
          </div>
          <div class="infield">
            <input v-model="school" type="text" placeholder="School" />
            <label></label>
          </div>
          <div class="infield">
            <input
              v-model="semesterLevel"
              type="text"
              placeholder="Semester/Level"
            />
            <label></label>
          </div>
          <div class="infield">
            <input
              v-model="subjects"
              type="text"
              placeholder="Subjects (comma-separated)"
            />
            <label></label>
          </div>
          <button :disabled="!isFormValidRegister">Sign Up</button>
        </form>
      </div>
      <div class="form-container sign-in-container">
        <form @submit.prevent="handleLogin">
          <h1>Sign in</h1>
          <div class="infield">
            <input v-model="emailLogin" type="email" placeholder="Email" />
            <label></label>
          </div>
          <div class="infield">
            <input
              v-model="passwordLogin"
              type="password"
              placeholder="Password"
            />
            <label></label>
          </div>
          <nuxt-link to="/authentication/forgot-password" class="forgot">
            Forgot Password
          </nuxt-link>
          <nuxt-link to="/authentication/request-magic-link" class="forgot">
            Use Magic Link
          </nuxt-link>
          <button :disabled="!isFormValidLogin">Sign In</button>
        </form>
      </div>
      <div class="overlay-container" id="overlayCon">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>Student Portal</h1>
            <p>Sign in with your student credentials</p>
            <button @click="signIn">Sign In</button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>New Student?</h1>
            <p>Enter your details and start your journey with us</p>
            <button @click="signUp">Sign Up</button>
          </div>
        </div>
        <button id="overlayBtn" @click="toggleOverlay">Toggle Overlay</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { toast } from "vue3-toastify";
import { useRouter, useFetch } from "#app";
import { useRoute } from "vue-router";
import { useAuthStore } from "~/stores/auth";

const containerRef = ref(null);
const toggleOverlay = () => {
  containerRef.value?.classList.toggle("right-panel-active");
};
const signIn = () => {
  containerRef.value?.classList.remove("right-panel-active");
};
const signUp = () => {
  containerRef.value?.classList.add("right-panel-active");
};

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const emailLogin = ref("");
const passwordLogin = ref("");
const isFormValidLogin = computed(() => {
  return emailLogin.value.trim() && passwordLogin.value.trim();
});

const handleLogin = async () => {
  if (!isFormValidLogin.value) {
    alert("Please fill out all fields.");
    return;
  }
  const payload = {
    email: emailLogin.value,
    password: passwordLogin.value,
  };
  toast.success("Authentication successful");
  router.push("/student/student-dashboard");
  // try {
  //   const { data, error } = await useFetch(
  //     "https://genertia-quizmakerbackend.onrender.com/auth/login/password",
  //     {
  //       method: "POST",
  //       body: payload,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   if (error.value) {
  //     toast.error("Login failed");
  //     return;
  //   }
  //   if (data.value.user?.role?.toLowerCase() === "professor") {
  //     toast.warning("This account isn't registered for a student");
  //     router.push("/");
  //     return;
  //   }
  //   authStore.setAuth({
  //     access_token: data.value.access_token,
  //     refresh_token: data.value.refresh_token,
  //     user: data.value.user,
  //   });
  //   toast.success("Authentication successful");
  //   router.push("/student/student-dashboard");
  // } catch (error) {
  //   toast.error("An error occurred during login");
  // }
};

const firstName = ref("");
const lastName = ref("");
const emailRegister = ref("");
const passwordRegister = ref("");
const confirmPassword = ref("");
const school = ref("");
const semesterLevel = ref("");
const subjects = ref("");

const isFormValidRegister = computed(() => {
  return (
    firstName.value.trim() &&
    lastName.value.trim() &&
    emailRegister.value.trim() &&
    passwordRegister.value &&
    confirmPassword.value &&
    school.value.trim() &&
    semesterLevel.value.trim() &&
    subjects.value.trim() &&
    passwordRegister.value === confirmPassword.value
  );
});

const handleRegister = async () => {
  if (!isFormValidRegister.value) {
    toast.error("Please fill out all fields correctly.");
    return;
  }
  const name = `${firstName.value.trim()} ${lastName.value.trim()}`;
  const payload = {
    email: emailRegister.value.trim(),
    grade_level: semesterLevel.value.trim(),
    name,
    password: passwordRegister.value,
    school: school.value.trim(),
    subjects_interested: subjects.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };
  toast.success("Registration successful!");
  // try {
  //   const { error } = await useFetch(
  //     "https://genertia-quizmakerbackend.onrender.com/auth/register/student",
  //     {
  //       method: "POST",
  //       body: payload,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   if (error.value) {
  //     toast.error("Registration failed.");
  //   } else {
  //     toast.success("Registration successful!");
  //   }
  // } catch (err) {
  //   toast.error("An error occurred during registration.");
  // }
};

const resizeHandler = () => {
  const width = window.innerWidth;
  if (
    route.path === "/authentication/student-auth" ||
    route.path === "/authentication/mobile-student-auth"
  ) {
    if (width < 768 && route.path !== "/authentication/mobile-student-auth") {
      router.push("/authentication/mobile-student-auth");
    } else if (width >= 768 && route.path !== "/authentication/student-auth") {
      router.push("/authentication/student-auth");
    }
  }
};

onMounted(() => {
  window.addEventListener("resize", resizeHandler);
});
onUnmounted(() => {
  window.removeEventListener("resize", resizeHandler);
});
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap");
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "Inter", sans-serif;
}
.info {
  height: 100vh;
  background: #f6f5f7;
  display: grid;
  place-content: center;
}
.container {
  position: relative;
  width: 850px;
  height: 700px;
  background-color: #fff;
  box-shadow: 25px 30px 55px #5557;
  border-radius: 13px;
  overflow: hidden;
}
.form-container {
  position: absolute;
  width: 60%;
  height: 100%;
  padding: 0 40px;
  transition: all 0.6s ease-in-out;
}
.sign-up-container {
  opacity: 0;
  z-index: 1;
}
.sign-in-container {
  z-index: 2;
}
form {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 50px;
}
h1 {
  color: #141e30;
}
.infield {
  position: relative;
  margin: 8px 0;
  width: 100%;
}
input {
  width: 100%;
  padding: 12px 15px;
  background-color: #f3f3f3;
  border: none;
  outline: none;
}
label {
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  width: 0%;
  height: 2px;
  background: var(--linear-grad);
  transition: 0.3s;
}
input:focus ~ label {
  width: 100%;
}
a {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}
a.forgot {
  padding-bottom: 3px;
  border-bottom: 2px solid #eee;
}
button {
  border-radius: 20px;
  border: 1px solid #ff784b;
  background: #ff784b;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.form-container button {
  margin-top: 17px;
  transition: 80ms ease-in;
}
.form-container button:hover {
  background: #fff;
  color: #ff784b;
}
.overlay-container {
  position: absolute;
  top: 0;
  left: 60%;
  width: 40%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 9;
}
#overlayBtn {
  cursor: pointer;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 143.67px;
  height: 40px;
  border: 1px solid #fff;
  background: transparent;
  border-radius: 20px;
}
.overlay {
  position: relative;
  background: #ff784b;
  color: #fff;
  left: -150%;
  height: 100%;
  width: 250%;
  transition: transform 0.6s ease-in-out;
}
.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  height: 100%;
  width: 340px;
  transition: transform 0.6s ease-in-out;
}
.overlay-left {
  right: 60%;
  transform: translateX(-12%);
}
.overlay-right {
  right: 0;
  transform: translateX(0%);
}
.overlay-panel h1 {
  color: #fff;
}
p {
  font-size: 14px;
  font-weight: 300;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 25px 0 35px;
}
.overlay-panel button {
  border: 1px solid #fff;
  background-color: transparent;
}
.right-panel-active .overlay-container {
  transform: translateX(-150%);
}
.right-panel-active .overlay {
  transform: translateX(50%);
}
.right-panel-active .overlay-left {
  transform: translateX(25%);
}
.right-panel-active .overlay-right {
  transform: translateX(35%);
}
.right-panel-active .sign-in-container {
  transform: translateX(20%);
  opacity: 0;
}
.right-panel-active .sign-up-container {
  transform: translateX(66.7%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}
@keyframes show {
  0%,
  50% {
    opacity: 0;
    z-index: 1;
  }
  50.1%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}
</style>
