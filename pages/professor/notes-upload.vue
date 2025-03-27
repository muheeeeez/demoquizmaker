<template>
  <div>
    <div class="top-container">
      <div><h1>QuizMakerAI</h1></div>
      <div class="navbar">
        <div class="navbar-container">
          <img src="/public/images/user.png" alt="User Icon" />
          <p>{{ name }}</p>
        </div>
        <div class="navbar-container">
          <img src="/public/images/logout.png" alt="Logout Icon" />
          <p @click="logout" class="logout">{{ isLoggingOut ? "Logging out..." : "Logout" }}</p>
        </div>
      </div>
    </div>

    <div class="upload-card">
      <div
        class="box"
        @dragover.prevent="onDragOver"
        @dragenter.prevent="onDragOver"
        @drop.prevent="onFileDrop"
      >
        <img
          src="/public/images/cloud-upload-alt.svg"
          class="image"
          alt="Upload Note"
        />
        <p @click="openFileDialog" class="box-p">
          Drag & Drop your notes files here
        </p>
        <p class="paragraph">or click to browse from your device</p>
        <p class="paragraph">PPT, PDF or TXT up to 10MB</p>
        <input
          ref="fileInput"
          type="file"
          multiple
          style="display: none"
          accept=".pdf, .txt, .pptx, .doc"
          @change="handleFileChange"
        />
        <div class="buttons">
          <button>Upload from Google Drive</button>
          <button>Upload from OneDrive</button>
        </div>
      </div>
    </div>

    <div class="file-card">
      <h1>Uploaded Notes</h1>
      <template v-if="fileNames.length === 0">
        <p class="no-files-message">There are currently no uploaded files</p>
      </template>
      <template v-else>
        <div class="files-grid">
          <div
            class="file-card-item"
            v-for="(name, index) in fileNames"
            :key="index"
          >
            <div class="checkbox-container" @click="toggleCheck(index)">
              <div class="check" v-show="checkedFiles[index]">✓</div>
              <input type="checkbox" class="input" />
            </div>
            <div class="file-card-content">
              <h2 class="file-name">{{ name }}</h2>
              <p class="file-lines">Lines: 50</p>
              <p class="file-type">Type: {{ getFileType(name) }}</p>
            </div>
            <button class="delete-btn" type="button">Delete</button>
          </div>
        </div>
      </template>
    </div>

    <div class="bottom-dialog" v-if="selectedCount > 0">
      <p>
        You selected {{ selectedCount }} file<span v-if="selectedCount > 1"
          >s</span
        >.
      </p>
      <button @click="saveConfiguration">Save</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuizConfig } from "~/composables/useQuizConfig";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { useAuthStore } from "~/stores/auth";

const route = useRoute();
const $toast = toast;
const authStore = useAuthStore();
const { configEnabled } = useQuizConfig();
const router = useRouter();
const isLoggingOut = ref(false);
const fileInput = ref(null);
const fileNames = ref([]);
const actualFiles = ref([]);
const checkedFiles = ref([]);

const selectedCount = computed(
  () => checkedFiles.value.filter((isChecked) => isChecked).length
);
const name = computed(() =>
  authStore.user && authStore.user.name ? authStore.user.name : "Guest"
);
const toggleCheck = (index) => {
  checkedFiles.value[index] = !checkedFiles.value[index];
};

const openFileDialog = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileChange = (event) => {
  const files = event.target.files;
  processFiles(files);
};

const onDragOver = () => {};

const onFileDrop = (event) => {
  const files = event.dataTransfer.files;
  processFiles(files);
};

const processFiles = (files) => {
  fileNames.value = [];
  actualFiles.value = [];
  checkedFiles.value = [];
  for (let i = 0; i < files.length; i++) {
    fileNames.value.push(files[i].name);
    actualFiles.value.push(files[i]);
    checkedFiles.value.push(false);
  }
};

const getFileType = (name) => {
  const parts = name.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "UNKNOWN";
};
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
  } catch (err) {
    $toast.error("An error occurred during logout.");
    console.error("Logout error:", err);
  } finally {
    isLoggingOut.value = false;
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

a {
  text-decoration: none;
  color: #fff;
}

.image {
  height: 80px;
  width: 150px;
  margin-bottom: 10px;
}

.top-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.top-container h1 {
  color: #ff784b;
  font-size: 26px;
  font-weight: bold;
}

.navbar {
  display: flex;
  gap: 30px;
  align-items: center;
}

.navbar-container {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #374151;
  cursor: pointer;
}

.logout:hover {
  color: #ff784b;
}

.upload-card {
  width: 90%;
  max-width: 900px;
  height: 400px;
  background-color: #fff;
  box-shadow: 2px 0px 10px rgba(3, 3, 3, 0.1);
  margin: 20px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100%;
  max-width: 800px;
  border: 1.5px dashed #9ca3af;
  gap: 5px;
  background-color: #f2f2f2;
  box-sizing: border-box;
}

.box:hover {
  border: 1.5px dashed #ff784b;
}

.box-p {
  color: #030303;
  cursor: pointer;
  font-size: 23.5px;
  font-weight: 600;
  text-align: center;
}

.paragraph {
  color: #979797;
  font-size: 15px;
  line-height: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-top: 15px;
}

.buttons button {
  cursor: pointer;
  width: 211px;
  height: 36px;
  padding: 0 8px;
  border: none;
  border-radius: 99999px;
  background-color: #ff784b;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  line-height: 20px;
  outline: none;
}

.file-card {
  width: 90%;
  max-width: 100%;
  background-color: #fff;
  box-shadow: 2px 0px 10px rgba(3, 3, 3, 0.1);
  margin: 30px auto;
  padding: 20px;
  word-wrap: break-word;
}

.file-card h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #111827;
  text-align: center;
}

.files-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
}

.file-card-item {
  background-color: #f9fafb;
  border: 1.5px solid #979797;
  border-radius: 8px;
  padding: 15px;
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-card-content {
  flex-grow: 1;
}

.file-name {
  font-size: 18px;
  color: #111827;
  margin: 0 0 5px;
}

.file-lines,
.file-type {
  font-size: 14px;
  color: #4b5563;
  margin: 2px 0;
}

.checkbox-container {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  pointer-events: auto;
  color: rgba(255, 120, 75, 1);
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.08);
  border: 1.5px solid rgba(118, 118, 118, 1);
  position: relative;
  flex-shrink: 0;
}

.check {
  transition: left 0.3s ease;
  z-index: 1;
  font-size: 12px;
}

.input {
  position: absolute;
  opacity: 0;
  visibility: hidden;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

.no-files-message {
  text-align: center;
  color: #4b5563;
  font-size: 16px;
  margin: 20px 0;
}

.bottom-dialog {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  padding: 15px 25px;
  border: 1px solid #979797;
  border-radius: 8px;
  box-shadow: 2px 0px 10px rgba(3, 3, 3, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.bottom-dialog p {
  margin: 0;
  font-size: 16px;
  color: #111827;
}

.bottom-dialog button {
  cursor: pointer;
  padding: 8px 16px;
  border: none;
  border-radius: 99999px;
  background-color: #ff784b;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
}

.delete-btn {
  cursor: pointer;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #e3342f;
  color: #fff;
  font-size: 14px;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .top-container {
    flex-direction: column;
    gap: 15px;
  }
  .box-p {
    font-size: 20px;
  }
  .paragraph {
    font-size: 14px;
  }
  .buttons button {
    width: 180px;
    font-size: 14px;
  }
  .file-card h1 {
    font-size: 20px;
  }
  .file-name {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .top-container {
    flex-direction: column;
    gap: 15px;
  }
  .upload-card,
  .file-card {
    width: 95%;
    margin: 10px auto;
  }
  .box {
    padding: 15px;
  }
  .buttons {
    flex-direction: column;
  }
  .buttons button {
    width: 100%;
  }
  .files-grid {
    flex-direction: column;
    align-items: center;
  }
  .file-card-item {
    width: 100%;
  }
  .checkbox-container {
    margin-bottom: 10px;
  }
}
</style>
