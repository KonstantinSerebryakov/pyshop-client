<template>
  <q-input
    v-model="data"
    label="Password"
    type="password"
    outlined
    bottom-slots
    :error="isShowError"
    :maxlength="128"
  >
    <template v-slot:error> {{ errorMessage }} </template>
  </q-input>
</template>

<script setup lang="ts">
import { computed, readonly, ref, watch } from 'vue';
import {
  PASSWORD_LENGTH_MAX,
  PASSWORD_LENGTH_MIN,
  PASSWORD_REGEXP
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
function showInvalidPasswordError(): void {
  isShowCustomError.value = true;
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
  return PASSWORD_REGEXP.test(inputString);
});

const errorMessage = computed(() => {
  if (!isShowError.value) return '';

  let message = '';
  const value = data.value;
  if (value.length === 0) {
    message = 'Password should not be empty';
  } else if (value.length < PASSWORD_LENGTH_MIN) {
    message = `Password should be at least ${PASSWORD_LENGTH_MIN} characters`;
  } else if (!value.match(/[A-Za-z]/)) {
    message = 'Password should include at least 1 letter';
  } else if (!value.match(/[0-9]/)) {
    message = 'Password should include at least 1 digit';
  } else if (!value.match(/[@$!%*#?&]/)) {
    message = 'Password should include at least 1 special symbol: @$!%*#?&';
  } else if (value.length > PASSWORD_LENGTH_MAX) {
    message = `Password should not be longer then ${PASSWORD_LENGTH_MAX} symbols`;
  } else if (isShowCustomError.value) {
    message = customError.value;
  }

  return message;
});

defineExpose({
  validate,
  value: readonly(data),
  showInvalidPasswordError
});
</script>
