<template>
  <q-page class="window-height">
    <div class="col-12 row full-height content-around">
      <q-form class="col-12" @submit="handleSubmit">
        <q-card class="auth-card col-12">
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
        </q-card>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { QBtn } from 'quasar';
import App from 'src/App.vue';
import EmailInput from 'src/components/auth/EmailInput.vue';
import PasswordInput from 'src/components/auth/PasswordInput.vue';
import { AuthApi } from 'src/utils/api/Auth.api';
import { ILoginQueryPayload } from 'src/utils/interfaces';
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';

const instance = getCurrentInstance();
const globalProperties = instance?.appContext.config.globalProperties;

const emailInputRef = ref(null as InstanceType<typeof EmailInput> | null);
const passwordInputRef = ref(null as InstanceType<typeof PasswordInput> | null);
const cancelSubmit = ref(null as (() => void) | null);

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

async function handleSubmit(event: SubmitEvent | Event) {
  event.preventDefault();
  handleCancel();

  if (!validate()) return;

  const data = getFormData();
  const axiosPair = await AuthApi.register(data);
  cancelSubmit.value = axiosPair.cancel;
  axiosPair.promise.then((response) => {
    if (!response) return;
    const status = response.status;
    if (status === 201) {
      handleSignUpSuccess(data);
    } else if (status === 409) {
      emailInputRef.value?.showEmailBusyError();
    }
  });
}

async function handleSignUpSuccess(data: ILoginQueryPayload) {
  AuthApi.login(data);
}

function handleCancel() {
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