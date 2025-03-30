<template>
  <div class="page">
    <div class="form-container">
      <form @submit.prevent="register">
        <img src="/images/prof-reg.png" alt="Professor Registration" />
        <h1>Professor Registration</h1>
        <div>
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
        </div>
        <div>
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
        </div>
        <div>
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
        </div>
        <input type="submit" value="Register" />
      </form>
    </div>
  </div>
</template>

<script setup>
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
/* General Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Inter", sans-serif;
}

/* Image Styling */
img {
  display: block;
  margin: 0 auto 10px auto;
  width: 120px;
  height: 120px;
  object-fit: cover;
}

/* Page Layout */
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  background-color: #f9f9f9;
  padding: 20px;
}

/* Form Container */
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Form Styling */
form {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 600px;
  box-sizing: border-box;
}

/* Header Styling */
h1 {
  color: #2c3e50;
  font-size: 36px;
  font-weight: 700;
  line-height: 44px;
  text-align: center;
  margin-bottom: 20px;
}

h2 {
  color: #34495e;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  margin-bottom: 10px;
}

/* Input Groups */
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
  height: 48px;
  padding: 12px 16px;
  margin-bottom: 16px;
  border: 1px solid #bdc3c7;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s;
  font-size: 16px;
}

input[type="email"]:focus,
input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #ff784b;
}

/* Submit Button */
input[type="submit"] {
  width: 100%;
  height: 48px;
  padding: 12px;
  background-color: #ff784b;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  transition: background-color 0.3s, color 0.3s;
}

input[type="submit"]:hover {
  background-color: #2980b9;
  color: #ecf0f1;
}

/* Form Sections */
.form-section {
  margin-bottom: 20px;
}

/* Responsive Styles */
@media (max-width: 768px) {
  form {
    width: 90%;
    margin: 0 auto;
  }
  .name-group {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 28px;
  }
  input[type="submit"] {
    font-size: 16px;
  }
}
</style>
