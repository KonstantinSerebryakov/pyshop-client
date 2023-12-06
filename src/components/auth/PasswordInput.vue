<template>
  <q-input
    v-model="data"
    label="Password"
    type="password"
    outlined
    bottom-slots
    :error="isShowInputMessage"
    :maxlength="PASSWORD_LENGTH_MAX"
  >
    <template v-slot:error> {{ inputMessage }} </template>
  </q-input>
</template>

<script setup lang="ts">
import { computed, onMounted, readonly, ref, watch } from 'vue';
import {
  PASSWORD_LENGTH_MAX,
  PASSWORD_LENGTH_MIN,
  PASSWORD_REGEXP
} from '@app/constants';
import { useInputMessage } from 'src/utils/composables/useInputMessage';

const inputMessageComposabe = useInputMessage();
function setInputMessage(message: string) {
  inputMessageComposabe.message.value = message;
}
const isShowInputMessage = inputMessageComposabe.isShowMessage;
const inputMessage = inputMessageComposabe.message;

const data = ref('');

function setErrorMessageValidation() {
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
  }
  setInputMessage(message);
}
function setErrorMessageInvalidPassword() {
  setInputMessage('Email or password are invalid.');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
watch(data, (newValue, oldValue) => {
  if (newValue.length > 0 && !isValid.value) {
    setErrorMessageValidation();
    inputMessageComposabe.show();
  } else {
    inputMessageComposabe.hide();
  }
});

function showError(): void {
  inputMessageComposabe.show();
}
function showInvalidPasswordError(): void {
  setErrorMessageInvalidPassword();
  showError();
}

function validate(): boolean {
  const valid = isValid.value;
  if (!valid) showError();
  return valid;
}
const isValid = computed((): boolean => {
  const inputString = data.value.toLowerCase().trim();
  return PASSWORD_REGEXP.test(inputString);
});

onMounted(() => {
  setErrorMessageValidation();
});

defineExpose({
  validate,
  value: computed(() => {
    return data.value.trim();
  }),
  showInvalidPasswordError
});
</script>
