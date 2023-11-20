<template>
  <q-page class="window-height">
    <div class="col-12 row full-height content-around">
      <q-form class="col-12" @submit="handleSubmit">
        <q-card class="auth-card col-12">
          <q-card-section class="q-px-md col-12">
            <div class="text-h6 text-center">Login</div>
            <email-input ref="emailInputRef" class="q-mt-lg" />
            <password-input ref="passwordInputRef" class="q-mt-lg" />
          </q-card-section>
          <q-card-actions align="right" class="q-px-md q-mb-md col-12">
            <q-btn type="submit" label="Login" color="primary" />
          </q-card-actions>
          <q-card-section class="q-px-md col-12 text-h7 text-center">
            Don't have an account?
            <q-btn
              :to="{
                path: '/signup',
                query: $route.query // Include the existing query parameters
              }"
              label="Sign Up"
              flat
              unelevated
              rounded
              dense
              color="purple"
            />
          </q-card-section>
        </q-card>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Notify, QNotifyUpdateOptions } from 'quasar';
import EmailInput from 'src/components/auth/EmailInput.vue';
import PasswordInput from 'src/components/auth/PasswordInput.vue';
import { AuthApi } from 'src/utils/api/auth-api';
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
    message: 'Authorizing...',
    position: 'top',
    timeout: 0 // Set timeout to 0 for an indefinite loading notification
  });

  const data = getFormData();
  const axiosPair = await AuthApi.login(data);
  cancelSubmit.value = axiosPair.abort;
  axiosPair.apiPromise
    .then((response) => {
      const dismiss = dismissNotify.value;
      if (dismiss) dismiss();
      if (!response) return;
      const status = response.status;
      if (status === 404 || status === 401) {
        emailInputRef.value?.showEmailInvalidError();
        passwordInputRef.value?.showInvalidPasswordError();
      }
    })
    .catch((res) => {
      console.log(res);
    });
}, 500);

function handleCancel() {
  const dismiss = dismissNotify.value;
  if (dismiss) dismiss();
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
src/utils/api/auth.api src/utils/api/auth-api
