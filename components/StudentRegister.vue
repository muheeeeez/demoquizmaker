<template>
  <div class="page">
    <div>
      <div class="form-container">
        <form @submit.prevent="handleSubmit">
          <img
            src="/public/images/student-reg.png"
            alt="Student Registration"
          />
          <h1>Register as a Student</h1>
          <div class="name-group">
            <input
              type="text"
              id="first-name"
              placeholder="First Name"
              v-model="firstName"
              required
            />
            <input
              type="text"
              id="last-name"
              placeholder="Last Name"
              v-model="lastName"
              required
            />
          </div>
          <input
            type="email"
            id="email"
            placeholder="School Email Address"
            v-model="email"
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            v-model="password"
            required
          />
          <input
            type="password"
            id="confirm-password"
            placeholder="Confirm Password"
            v-model="confirmPassword"
            required
          />
          <input
            type="text"
            id="school"
            placeholder="School Name"
            v-model="school"
            required
          />
          <input
            type="text"
            id="semester-level"
            placeholder="Grade Level"
            v-model="semesterLevel"
            required
          />
          <input
            type="text"
            id="subjects"
            placeholder="Subjects (comma separated)"
            v-model="subjects"
            required
          />
          <input type="submit" value="Register" :disabled="!isFormValid" />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup >
import { ref, computed } from "vue";
import { toast } from "vue3-toastify";

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const school = ref("");
const semesterLevel = ref("");
const subjects = ref("");
const isFormValid = computed(() => {
  return (
    firstName.value.trim() &&
    lastName.value.trim() &&
    email.value.trim() &&
    password.value &&
    confirmPassword.value &&
    school.value.trim() &&
    semesterLevel.value.trim() &&
    subjects.value.trim() &&
    password.value === confirmPassword.value
  );
});

const handleSubmit = async () => {
  if (!isFormValid.value) {
    toast.error("Please fill out all fields correctly.");
    return;
  }

  const name = `${firstName.value.trim()} ${lastName.value.trim()}`;
  const payload = {
    email: email.value.trim(),
    grade_level: semesterLevel.value.trim(),
    name,
    password: password.value,
    school: school.value.trim(),
    subjects_interested: subjects.value
      .split(",")
      .map((subject) => subject.trim())
      .filter(Boolean),
  };

  try {
    const { error } = await useFetch(
      "https://genertia-quizmakerbackend.onrender.com/auth/register/student",
      {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (error.value) {
      toast.error("Registration failed.");
      console.error("API error:", error.value);
    } else {
      toast.success("Registration successful!");
    }
  } catch (err) {
    toast.error("An error occurred during registration.");
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
  margin: 0 auto;
  width: 100px;
  height: 100px;
}

.page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  padding: 20px;
}

.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

form {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

h1 {
  color: #333;
  font-size: 28px;
  font-weight: 700;
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
}

input[type="email"],
input[type="text"],
input[type="password"] {
  width: 100%;
  height: 50px;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

input[type="email"]:focus,
input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #007bff;
  outline: none;
}

input[type="submit"] {
  width: 100%;
  height: 44px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  margin-top: 10px;
  transition: background-color 0.3s;
}

input[type="submit"]:hover:enabled {
  background-color: #0056b3;
}

input[type="submit"]:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  h1 {
    font-size: 22px;
  }

  input[type="email"],
  input[type="text"],
  input[type="password"] {
    height: 45px;
  }

  input[type="submit"] {
    font-size: 14px;
    height: 40px;
  }
}
</style>
