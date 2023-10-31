<template>
  <q-input
    v-model="data"
    label="Email"
    type="email"
    outlined
    bottom-slots
    :error="isShowError"
    :maxlength="255"
  >
    <template v-slot:error>
      <span class="">
        {{ errorMessage }}
        <router-link v-if="isShowCustomError" to="/signin" class="text-purple"
          >Sign In</router-link
        >
      </span>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { computed, readonly, ref, watch } from 'vue';
import {
  EMAIL_LENGTH_MAX,
  EMAIL_LENGTH_MIN,
  EMAIL_REGEXP
} from '@app/constants';

const data = ref('');
const isShowError = ref(false);
const isShowCustomError = ref(false);
const customError = ref('');

watch(data, (newValue, oldValue) => {
  isShowError.value = newValue.length > 0 && !isValid.value;
});

function showError(): void {
  isShowError.value = true;
}
function showEmailBusyError(): void {
  isShowCustomError.value = true;
  customError.value = 'This email is busy. try another or ';
  showError();
}
function showEmailNotFoundError(): void {
  isShowCustomError.value = true;
  // customError.value = 'No user related to given email. Navigate to ';
  customError.value = 'Email or password are invalid';
  showError();
}

function validate(): boolean {
  const isNotValid = !isValid.value;
  if (isNotValid) showError();
  return !isNotValid;
}

function getValueString(): string {
  return data.value.toLowerCase().trim();
}

const isValid = computed((): boolean => {
  const inputString = getValueString();
  return EMAIL_REGEXP.test(inputString);
});

const errorMessage = computed(() => {
  if (!isShowError.value) return '';

  let message = 'Input should be valid email';
  const value = data.value;
  if (value.length === 0) {
    message = 'Email should not be empty';
  } else if (value.length < EMAIL_LENGTH_MIN) {
    message = `Email should be at least ${EMAIL_LENGTH_MIN} characters`;
  } else if (value.length > EMAIL_LENGTH_MAX) {
    message = `Email should not be longer then ${EMAIL_LENGTH_MAX} symbols`;
  } else if (isShowCustomError.value) {
    message = customError.value;
  }

  return message;
});
defineExpose({
  validate,
  value: readonly(data),
  showEmailBusyError,
  showEmailNotFoundError
});
</script>
