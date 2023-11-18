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
import PhoneCountryCode from 'src/components/user-info/PhoneCountryCode.vue';
import { computed, onBeforeMount, onMounted, readonly, ref, watch } from 'vue';
import {
  AsYouType,
  CountryCode,
  getCountryCallingCode,
  getExampleNumber,
  isSupportedCountry,
  isValidPhoneNumber,
  parsePhoneNumber
} from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';
import { QInput } from 'quasar';

const data = ref(null as null | string);
const countryCode = ref('' as string);
const asYouType = ref(new AsYouType());

const inputLength = computed(() => {
  const maxLength = 15;
  const value = countryCode.value;
  if (isSupportedCountry(value)) {
    const code = value as CountryCode;
    const exampleNumber = getExampleNumber(
      code,
      examples
    )?.formatInternational();
    const variablePart = exampleNumber?.split(' ').slice(1).join('');
    return variablePart?.length ?? maxLength;
  }
  return maxLength;
});
const inputRef = ref(null as null | InstanceType<typeof QInput>);

const prefix = computed(() => {
  const value = countryCode.value;
  if (isSupportedCountry(value)) {
    const code = value as CountryCode;
    return `+${getCountryCallingCode(code)}`;
  } else {
    return '+';
  }
});

const fullPhoneNumber = computed(() => {
  if (!data.value) return null;
  return prefix.value + data.value;
});

function selectCountryCode(code: string) {
  countryCode.value = code;
  const value = countryCode.value;
  if (isSupportedCountry(value)) {
    asYouType.value = new AsYouType(value);
  }
}

function handleCountrySelected(code: string) {
  inputRef.value?.focus();
  selectCountryCode(code);
}

const isShowMessage = ref(false);
const message = ref('');
const messageType = ref('Error' as 'Info' | 'Error');

watch(data, (newValue, oldValue) => {
  message.value = '';
  isShowMessage.value = false;
});

function showMessage(): void {
  isShowMessage.value = true;
  messageType.value = 'Info';
}

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

const isValid = computed((): boolean => {
  if (!isSupportedCountry(countryCode.value)) return false;
  if (!data.value) return true;
  asYouType.value.reset();
  asYouType.value.input(data.value);
  return asYouType.value.isValid();
});

function setValue(value: string | null) {
  if (!value) {
    data.value = value;
    return;
  }
  if (!isValidPhoneNumber(value)) {
    console.log('number is not valid');
    return;
  }
  const number = parsePhoneNumber(value);
  const code = number.country;
  if (!code || !isSupportedCountry(code)) {
    console.log('number is not supported');
    return;
  }
  countryCode.value = code;
  selectCountryCode(code);
  data.value = number.formatInternational().split(' ').slice(1).join('');
}
function clearValue() {
  data.value = null;
}
defineExpose({
  validate,
  value: readonly(fullPhoneNumber),
  setValue: setValue,
  clearValue: clearValue
});
</script>
<style scoped></style>
