import { ref } from "vue";

export const configEnabled = ref(false);

export function useQuizConfig() {
  return { configEnabled };
}
