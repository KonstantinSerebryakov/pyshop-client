<template>
  <q-page class="window-height">
    <div class="col-12 row full-height content-around">
      <q-card class="auth-card col-12">
        <q-form class="col-12" @submit="handleSubmit">
          <q-card-section class="q-px-md col-12">
            <div class="text-h6 text-center">Register</div>
            <email-input ref="emailInputRef" class="q-mt-lg" />
            <password-input ref="passwordInputRef" class="q-mt-lg" />
          </q-card-section>
          <q-card-actions align="right" class="q-px-md q-mb-md col-12">
            <q-btn type="submit" label="Register" color="primary" />
          </q-card-actions>
          <q-card-section class="q-px-md col-12 text-h7 text-center">
            Already have an account?
            <q-btn
              :to="{
                path: '/signin',
                query: $route.query // Include the existing query parameters
              }"
              label="Sign In"
              flat
              unelevated
              rounded
              dense
              color="purple"
            />
          </q-card-section>
        </q-form>
        <q-separator :inset="true" />
        <div class="text-h6 text-center">OR</div>
        <q-separator :inset="true" />
        <q-card-section class="row justify-center align-center">
          <sign-in-google-button class="q-mx-auto"></sign-in-google-button>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Notify, QBtn, QNotifyUpdateOptions } from 'quasar';
import EmailInput from 'src/components/auth/EmailInput.vue';
import PasswordInput from 'src/components/auth/PasswordInput.vue';
import SignInGoogleButton from 'src/components/auth/SignInGoogleButton.vue';
import { AuthApi } from 'src/utils/api/AuthApi';
import { ILoginQueryPayload } from 'src/utils/interfaces';
import { throttle } from 'src/utils/utility/throttle';
import { onUnmounted, ref } from 'vue';

const emailInputRef = ref(null as InstanceType<typeof EmailInput> | null);
const passwordInputRef = ref(null as InstanceType<typeof PasswordInput> | null);

const cancelSubmit = ref(null as (() => void) | null);
const dismissNotify = ref(
  null as null | ((props?: QNotifyUpdateOptions) => void)
);

function validate() {
  let isValid = true;
  isValid = (emailInputRef.value?.validate() ?? false) && isValid;
  isValid = (passwordInputRef.value?.validate() ?? false) && isValid;
  return isValid;
}

function getFormData() {
  return {
    email: emailInputRef.value?.value ?? '',
    password: passwordInputRef.value?.value ?? ''
  };
}

const handleSubmit = throttle(async (event: SubmitEvent | Event) => {
  event.preventDefault();
  if (!validate()) return;
  handleCancel();
  dismissNotify.value = Notify.create({
    type: 'info',
    spinner: true,
    message: 'Authentificating...',
    position: 'top',
    timeout: 0 // Set timeout to 0 for an indefinite loading notification
  });

  const data = getFormData();
  const axiosPair = await AuthApi.register(data);
  cancelSubmit.value = axiosPair.abort;
  axiosPair.apiPromise.then((response) => {
    handleDismissNotify();
    if (!response) return;
    const status = response.status;
    if (status === 201) {
      handleSignUpSuccess(data);
    } else if (status === 409) {
      emailInputRef.value?.showEmailBusyError();
    }
  });
}, 500);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handleSignUpSuccess(data: ILoginQueryPayload) {
  Notify.create({
    type: 'info',
    message: 'User successfully created.',
    position: 'top'
  });
  // OR navigate to signin
  AuthApi.login(data);
}

function handleDismissNotify() {
  const dismiss = dismissNotify.value;
  if (dismiss) {
    dismiss();
    dismissNotify.value = null;
  }
}
function handleCancel() {
  handleDismissNotify();
  const cancel = cancelSubmit.value;
  if (cancel !== null) {
    cancel();
    cancelSubmit.value = null;
  }
}

onUnmounted(() => {
  handleCancel();
});
</script>
<style scoped></style>
src/utils/api/AuthApi
