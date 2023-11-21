<template>
  <!-- Note: required for classic js form data extraction -->
  <q-input
    v-model="fullPhoneNumber"
    name="phone"
    style="display: none"
  ></q-input>
  <q-input
    v-model="data"
    type="tel"
    bottom-slots
    :error="isShowMessage"
    class="q-px-none"
    :prefix="`${prefix}`"
    ref="inputRef"
    :maxlength="inputLength"
    :mask="''.padEnd(50, '#')"
    :clearable="true"
    :square="false"
    :outlined="true"
    input-class=""
  >
    <template v-slot:before>
      <!-- class="q-mr-md" -->
      <phone-country-code
        :code="countryCode"
        @selected="handleCountrySelected"
      ></phone-country-code>
    </template>
    <template v-slot:error>
      <div v-if="messageType === 'Error'">
        <span class="">
          {{ message }}
        </span>
      </div>
      <div v-if="messageType === 'Info'">
        <span class="text-black">
          {{ message }}
        </span>
      </div>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import PhoneCountryCode from './PhoneCountryCode.vue';
import { computed, readonly, ref, watch } from 'vue';
import { QInput } from 'quasar';
import { useLibphonenumber } from './UseLibphonenumber';

const phoneNumberComposable = useLibphonenumber();
const inputLength = phoneNumberComposable.length;
const prefix = phoneNumberComposable.prefix;
const fullPhoneNumber = computed(() => {
  if (!data.value) return null;
  return prefix.value + data.value;
});
const countryCode = phoneNumberComposable.countryCode;
const data = phoneNumberComposable.number;
const isValid = phoneNumberComposable.isValid;

const inputRef = ref(null as null | InstanceType<typeof QInput>);

function handleCountrySelected(code: string) {
  inputRef.value?.focus();
  phoneNumberComposable.setPhoneCountryCode(code);
}

const isShowMessage = ref(false);
const message = ref('');
const messageType = ref('Error' as 'Info' | 'Error');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
watch(data, (newValue, oldValue) => {
  message.value = '';
  isShowMessage.value = false;
});

function showError(): void {
  isShowMessage.value = true;
  message.value = 'Please, input valid phone number';
  messageType.value = 'Error';
}

function validate(): boolean {
  const isNotValid = !isValid.value;
  if (isNotValid) showError();
  return !isNotValid;
}

function setValue(value: string | null) {
  phoneNumberComposable.setPhone(value);
}
function clearValue() {
  phoneNumberComposable.setPhone(null);
  // data.value = null;
}
defineExpose({
  validate,
  value: readonly(fullPhoneNumber),
  setValue: setValue,
  clearValue: clearValue,
});
</script>
<style scoped></style>
