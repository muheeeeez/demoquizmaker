<template>
  <div class="page">
    <div class="form-container">
      <form @submit.prevent="register">
        <img src="/images/prof-reg.png" alt="Professor Registration" />
        <h1>Professor Registration</h1>
        <div class="name-group">
          <input
            type="text"
            v-model="firstName"
            placeholder="First Name"
            required
          />
          <input
            type="text"
            v-model="lastName"
            placeholder="Last Name"
            required
          />
        </div>
        <input
          type="email"
          v-model="email"
          placeholder="Email Address"
          required
        />
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          required
        />
        <input
          type="password"
          v-model="confirmPassword"
          placeholder="Confirm Password"
          required
        />
        <input
          type="text"
          v-model="institution"
          placeholder="Institution"
          required
        />
        <input
          type="text"
          v-model="academicTitle"
          placeholder="Academic Title"
          required
        />
        <input
          type="text"
          v-model="department"
          placeholder="Department"
          required
        />
        <input type="text" v-model="subject" placeholder="Subject" required />
        <input type="submit" value="Register" />
      </form>
    </div>
  </div>
</template>

<script setup >
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const router = useRouter();
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const institution = ref("");
const academicTitle = ref("");
const department = ref("");
const subject = ref("");

const register = async () => {
  if (password.value !== confirmPassword.value) {
    toast.error("Passwords do not match");
    return;
  }
  const name = `${firstName.value} ${lastName.value}`.trim();
  const payload = {
    email: email.value,
    name,
    role: "professor",
    password: password.value,
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
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Inter", sans-serif;
}

img {
  display: block;
  margin: 0 auto 10px auto;
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 10px 10px 10px 10px rgba(0, 0, 0, 0.1);
  width: 600px;
  box-sizing: border-box;
}

h1 {
  color: #030303;
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
  text-align: center;
  margin-bottom: 20px;
}

.name-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.name-group input[type="text"] {
  flex: 1;
  width: auto;
}

input[type="email"],
input[type="text"],
input[type="password"] {
  width: 100%;
  height: 50px;
  padding: 10px 16px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 9999px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input[type="email"]:focus,
input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #ff784b;
}

input[type="submit"] {
  width: 100%;
  height: 44px;
  padding: 10px;
  background-color: #ff784b;
  color: #fff;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
  font-weight: 700;
  line-height: 16px;
  transition: background-color 0.3s, color 0.3s;
}

input[type="submit"]:hover {
  background: transparent;
  color: #ff784b;
  border: 1px solid #ff784b;
}

@media (max-width: 768px) {
  .page {
    min-height: 100vh;
  }
  form {
    width: 80%;
    margin: 0 20px;
  }
  .name-group {
    flex-direction: column;
  }
}
@media (max-width: 480px) {
  .page {
    padding: 20px;
  }
  form {
    width: 100%;
    padding: 16px;
    box-shadow: none;
  }
  h1 {
    font-size: 28px;
  }
  input[type="submit"] {
    font-size: 14px;
  }
}
</style>
