<template>
  <q-input
    v-model="data"
    label="Email"
    type="email"
    outlined
    bottom-slots
    :error="isShowInputMessage"
    :maxlength="EMAIL_LENGTH_MAX"
  >
    <template v-slot:error>
      <span class="">
        {{ inputMessage }}
        <router-link
          v-if="isShowInputMessageNavigation"
          :to="inputMessageNavigation.to"
          class="text-purple"
          >{{ inputMessageNavigation.label }}</router-link
        >
      </span>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { computed, onMounted, readonly, ref, watch } from 'vue';
import { EMAIL_LENGTH_MAX, EMAIL_LENGTH_MIN } from '@app/constants';
import { useInputMessage } from 'src/utils/composables/useInputMessage';
import { patterns } from 'quasar';

const inputMessageComposabe = useInputMessage();
function setInputMessage(message: string) {
  inputMessageComposabe.message.value = message;
}
const isShowInputMessage = inputMessageComposabe.isShowMessage;
const inputMessage = inputMessageComposabe.message;

const isShowInputMessageNavigation = ref(false);
const inputMessageNavigation = ref({ to: '/', label: '/' });

const data = ref('');

function setErrorMessageValidation() {
  let message = 'Input should be valid email';
  const value = data.value;
  if (value.length === 0) {
    message = 'Email should not be empty';
  } else if (value.length < EMAIL_LENGTH_MIN) {
    message = `Email should be at least ${EMAIL_LENGTH_MIN} characters`;
  } else if (value.length > EMAIL_LENGTH_MAX) {
    message = `Email should not be longer then ${EMAIL_LENGTH_MAX} symbols`;
  }
  setInputMessage(message);
}
function setErrorMessageEmailBusy() {
  setInputMessage('This email is busy. try another or ');
}
function setErrorMessageInvalidEmail() {
  setInputMessage('Email or password are invalid. New user? ');
}

function setInputMessageNavigationToSignIn() {
  inputMessageNavigation.value.to = '/signin';
  inputMessageNavigation.value.label = 'Sign In';
}
function setInputMessageNavigationToSignUp() {
  inputMessageNavigation.value.to = '/signup';
  inputMessageNavigation.value.label = 'Sign Up';
}
function showInputMessageNavigation() {
  isShowInputMessageNavigation.value = true;
}
function hideInputMessageNavigation() {
  isShowInputMessageNavigation.value = false;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
watch(data, (newValue, oldValue) => {
  hideInputMessageNavigation();
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
function showEmailBusyError(): void {
  setErrorMessageEmailBusy();
  showError();
  setInputMessageNavigationToSignIn();
  showInputMessageNavigation();
}
function showEmailInvalidError(): void {
  setErrorMessageInvalidEmail();
  showError();
  setInputMessageNavigationToSignUp();
  showInputMessageNavigation();
}

function validate(): boolean {
  const valid = isValid.value;
  if (!valid) showError();
  return valid;
}
const isValid = computed((): boolean => {
  const inputString = data.value.toLowerCase().trim();
  const { testPattern } = patterns;
  return testPattern.email(inputString);
  // return EMAIL_REGEXP.test(inputString);
});

onMounted(() => {
  setErrorMessageValidation();
});

defineExpose({
  validate,
  value: readonly(data),
  showEmailBusyError,
  showEmailInvalidError
});
</script>
