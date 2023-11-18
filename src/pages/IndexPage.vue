<template>
  <q-page class="q-pt-md q-pb-md">
    <div class="q-mx-auto" style="max-width: 600px">
      <q-card class="col-12 q-pa-md">
        <q-form @submit="handleSubmit">
          <div class="text-h5">Name</div>
          <name-input ref="nameRef"></name-input>
          <div class="text-h5">Phone</div>
          <phone-input ref="phoneRef"></phone-input>
          <div class="text-h5">Address</div>
          <address-input ref="addressRef"></address-input>
          <div class="text-h5">About</div>
          <about-input ref="aboutRef"></about-input>
          <q-card-actions>
            <q-space></q-space>
            <q-btn
              label="submit"
              class=""
              type="submit"
              :loading="!isDataReady"
            ></q-btn>
            <q-btn
              label="reset"
              class=""
              @click="handleReset"
              :loading="!isDataReady"
            ></q-btn>
            <q-btn
              label="delete"
              class="bg-negative"
              @click="handleDelete"
              :loading="!isDataReady"
            ></q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import NameInput from 'src/components/user-info/NameInput.vue';
import PhoneInput from 'src/components/user-info/PhoneInput.vue';
import AddressInput from 'src/components/user-info/AddressInput.vue';
import AboutInput from 'src/components/user-info/AboutInput.vue';
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { IUserInfoUpdate } from 'src/utils/interfaces/accounts/user-info.interface';
import { useUserInfoStore } from 'src/stores/user-info-store';
import { onBeforeRouteLeave } from 'vue-router';
import { Notify } from 'quasar';
import { UserInfoEntity } from 'src/utils/entities';

const nameRef = ref(null as null | InstanceType<typeof NameInput>);
const phoneRef = ref(null as null | InstanceType<typeof PhoneInput>);
const addressRef = ref(null as null | InstanceType<typeof AddressInput>);
const aboutRef = ref(null as null | InstanceType<typeof AboutInput>);

const userInfoStore = useUserInfoStore();
const api = userInfoStore.api;
const cancel = ref((() => {/*  */}) as () => void); // prettier-ignore
const isDataReady = ref(false);

function validate() {
  let isValid = true;
  isValid = (nameRef.value?.validate() ?? false) && isValid;
  isValid = (phoneRef.value?.validate() ?? false) && isValid;
  isValid = (addressRef.value?.validate() ?? false) && isValid;
  isValid = (aboutRef.value?.validate() ?? false) && isValid;
  return isValid;
}

function getFormData(): IUserInfoUpdate {
  return {
    name: nameRef.value?.value ?? null,
    phone: phoneRef.value?.value ?? null,
    address: addressRef.value?.value ?? null,
    about: aboutRef.value?.value ?? null
  };
}

async function handleSubmit(evt: Event) {
  evt.preventDefault();
  if (!isDataReady.value) return;
  cancel.value();

  if (!validate()) return;
  const formData = getFormData();
  const formDataEntity = new UserInfoEntity(formData);

  const apiPayload = await api.put(formDataEntity);
  cancel.value = apiPayload.cancel;
  const promise = apiPayload.promise.then((result) => {
    if (result) {
      const status = result?.status;
      const data = result?.data;
      if (status === 200) {
        Notify.create({ type: 'info', message: 'submitted' });
      }
    }
  });
}
function handleReset() {
  if (!isDataReady.value) return;
  cancel.value();
  if (userInfoStore.$state.data) {
    extractInputValuesFromStore();
  } else {
    clearInputValues();
  }
  Notify.create({ type: 'info', message: 'changes resetted' });
}
async function handleDelete() {
  if (!isDataReady.value) return;
  cancel.value();

  const apiPayload = await api.clear();
  cancel.value = apiPayload.cancel;
  const promise = apiPayload.promise.then((result) => {
    if (result) {
      const status = result?.status;
      const data = result?.data;
      if (status === 200) {
        Notify.create({ type: 'info', message: 'cleared' });
        clearInputValues();
      }
    }
  });
}

function extractInputValuesFromStore() {
  const data = userInfoStore.$state.data;
  nameRef.value?.setValue(data?.name ?? null);
  phoneRef.value?.setValue(data?.phone ?? null);
  addressRef.value?.setValue(data?.address ?? null);
  aboutRef.value?.setValue(data?.about ?? '');
}
function clearInputValues() {
  nameRef.value?.clearValue();
  phoneRef.value?.clearValue();
  addressRef.value?.clearValue();
  aboutRef.value?.clearValue();
}

onBeforeMount(() => {
  userInfoStore.setKeys(null, null);
  api
    .fetch()
    .then((apiPayload) => {
      cancel.value = apiPayload.cancel;
      return apiPayload.promise;
    })
    .then((result) => {
      const status = result?.status;
      const data = result?.data;
      if (status && status === 200 && data) {
        isDataReady.value = true;
        extractInputValuesFromStore();
      }
    });
});
onBeforeUnmount(() => {
  cancel.value();
});
onBeforeRouteLeave((to, from, next) => {
  // cancel.value();
  userInfoStore.clear();
  next();
});
</script>
