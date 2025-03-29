<template>
  <div class="info">
    <div class="container" id="container">
      <div class="form-container sign-up-container">
        <form @submit.prevent="register">
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
            <input v-model="registerEmail" type="email" placeholder="Email" />
            <label></label>
          </div>
          <div class="infield">
            <input
              v-model="registerPassword"
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
            <input
              v-model="institution"
              type="text"
              placeholder="Institution"
            />
            <label></label>
          </div>
          <div class="infield">
            <input v-model="department" type="text" placeholder="Department" />
            <label></label>
          </div>
          <div class="infield">
            <input
              v-model="academicTitle"
              type="text"
              placeholder="Academic Title"
            />
            <label></label>
          </div>
          <div class="infield">
            <input v-model="subject" type="text" placeholder="Subject" />
            <label></label>
          </div>

          <button id="signUpBtn">Sign Up</button>
        </form>
      </div>

      <div class="form-container sign-in-container">
        <form @submit.prevent="handleLogin">
          <h1>Sign in</h1>
          <div class="infield">
            <input v-model="loginEmail" type="email" placeholder="Email" />
            <label></label>
          </div>
          <div class="infield">
            <input
              v-model="loginPassword"
              type="password"
              placeholder="Password"
            />
            <label></label>
          </div>
          <a href="#" class="forgot">Forgot your password?</a>
          <button id="signInBtn">Sign In</button>
        </form>
      </div>

      <div class="overlay-container" id="overlayCon">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>Professor Portal</h1>
            <p>
              To keep connected with us, please sign in with your professor
              credentials.
            </p>
            <button id="signInOverlayBtn">Sign In</button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>New Professor?</h1>
            <p>
              Enter your details to create a professor account and start your
              journey.
            </p>
            <button id="signUpOverlayBtn">Sign Up</button>
          </div>
        </div>
        <button id="overlayBtn">Toggle Overlay</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { useAuthStore } from "~/stores/auth";

const firstName = ref("");
const lastName = ref("");
const registerEmail = ref("");
const registerPassword = ref("");
const confirmPassword = ref("");
const institution = ref("");
const academicTitle = ref("");
const department = ref("");
const subject = ref("");

const signUpDisabled = ref(true);

watch(
  [
    firstName,
    lastName,
    registerEmail,
    registerPassword,
    confirmPassword,
    institution,
    department,
    academicTitle,
    subject,
  ],
  () => {
    signUpDisabled.value =
      !firstName.value.trim() ||
      !lastName.value.trim() ||
      !registerEmail.value.trim() ||
      !registerPassword.value.trim() ||
      !confirmPassword.value.trim() ||
      !institution.value.trim() ||
      !department.value.trim() ||
      !academicTitle.value.trim() ||
      !subject.value.trim();
  },
  { immediate: true }
);

const loginEmail = ref("");
const loginPassword = ref("");
const signInDisabled = ref(true);

watch(
  [loginEmail, loginPassword],
  () => {
    signInDisabled.value =
      !loginEmail.value.trim() || !loginPassword.value.trim();
  },
  { immediate: true }
);

onMounted(() => {
  const container = document.getElementById("container");
  const signUpBtn = document.getElementById("signUpBtn");
  const signInBtn = document.getElementById("signInBtn");
  const signUpOverlayBtn = document.getElementById("signUpOverlayBtn");
  const signInOverlayBtn = document.getElementById("signInOverlayBtn");
  const overlayBtn = document.getElementById("overlayBtn");
  if (overlayBtn) {
    overlayBtn.addEventListener("click", () => {
      container.classList.toggle("right-panel-active");
    });
  }
  if (signUpBtn) {
    signUpBtn.addEventListener("click", () => {
      container.classList.add("right-panel-active");
    });
  }
  if (signInBtn) {
    signInBtn.addEventListener("click", () => {
      container.classList.remove("right-panel-active");
    });
  }
  if (signUpOverlayBtn) {
    signUpOverlayBtn.addEventListener("click", () => {
      container.classList.add("right-panel-active");
    });
  }
  if (signInOverlayBtn) {
    signInOverlayBtn.addEventListener("click", () => {
      container.classList.remove("right-panel-active");
    });
  }

  watch(
    signUpDisabled,
    (newVal) => {
      if (signUpBtn) {
        signUpBtn.disabled = newVal;
      }
    },
    { immediate: true }
  );

  watch(
    signInDisabled,
    (newVal) => {
      if (signInBtn) {
        signInBtn.disabled = newVal;
      }
    },
    { immediate: true }
  );
});

const router = useRouter();

const register = async () => {
  if (registerPassword.value !== confirmPassword.value) {
    toast.error("Passwords do not match");
    return;
  }

  const name = `${firstName.value} ${lastName.value}`.trim();
  const payload = {
    email: registerEmail.value,
    name,
    role: "professor",
    password: registerPassword.value,
    institution: institution.value,
    department: department.value,
    academic_title: academicTitle.value,
    specialization: "",
    subjects: [subject.value],
    verification_status: "pending",
  };

  try {
    const { data, error } = await useFetch(
      "https://genertia-quizmakerbackend.onrender.com/auth/register/professor",
      {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (error.value) {
      toast.error("Registration failed");
      console.error("API error:", error.value);
    } else {
      toast.success("Registration successful. Please verify your email");
      router.push("/authentication/professor-auth");
    }
  } catch (err) {
    toast.error("An error occurred during registration");
    console.error(err);
  }
};

const authStore = useAuthStore();

const handleLogin = async () => {
  const payload = {
    email: loginEmail.value,
    password: loginPassword.value,
  };
  try {
    const data = await $fetch(
      "https://genertia-quizmakerbackend.onrender.com/auth/login/password",
      {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!data.user?.role || data.user.role.toLowerCase() !== "professor") {
      toast.warning("This account isn't registered for professor login.");
      router.push("/");
      return;
    }
    authStore.setAuth({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user: data.user,
    });
    toast.success("Authentication successful");
    router.push("/professor/professor-dashboard");
  } catch (error) {
    toast.error("An error occurred during login");
    console.error(error);
  }
};
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

.social-container {
  margin: 20px 0;
}

.social-container a {
  border: 1px solid #ddd;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
}

span {
  font-size: 12px;
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
  transition: 0.3s;
  background: linear-gradient(to right, #141e30, #ff784b);
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
