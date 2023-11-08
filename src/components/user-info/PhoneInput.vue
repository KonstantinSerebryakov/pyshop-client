<template>
  <q-input
    v-model="data"
    type="tel"
    bottom-slots
    :error="isShowMessage"
    class="q-px-none tmp"
    :prefix="`+${prefix}`"
    ref="input"
    :maxlength="inputLength"
    :mask="''.padEnd(50, '#')"
    :clearable="true"
  >
    <template v-slot:prepend>
      <phone-country-code
        class="q-mr-md"
        :code="countryCode"
        @selected="handleCountrySelected"
      ></phone-country-code>
    </template>
    <template v-slot:error>
      <div>
        <span class="text-dark">
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
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  isSupportedCountry,
  isValidPhoneNumber
} from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';
import { QInput } from 'quasar';

const data = ref(null as null | string);
const countryCode = ref('' as string);

const inputLength = computed(() => {
  const maxLength = 15;
  const value = countryCode.value;
  if (isSupportedCountry(value)) {
    const code = value as CountryCode;
    const exampleNumber = getExampleNumber(
      code,
      examples
    )?.formatInternational();
    // console.log(exampleNumber);
    const variablePart = exampleNumber?.split(' ').slice(1).join('');
    return variablePart?.length ?? maxLength;
  }
  return maxLength;
});

const prefix = computed(() => {
  const value = countryCode.value;
  if (isSupportedCountry(value)) {
    const code = value as CountryCode;
    return getCountryCallingCode(code);
  } else {
    return '';
  }
});

function handleCountrySelected(code: string) {
  countryCode.value = code;
}

const isShowMessage = ref(false);
const message = ref('');

watch(data, (newValue, oldValue) => {
  message.value = '';
  isShowMessage.value = false;
});

function showMessage(): void {
  isShowMessage.value = true;
}
function showClearedMessage(): void {
  message.value = 'data has been cleared';
  showMessage();
}

function validate(): boolean {
  const isNotValid = !isValid.value;
  if (isNotValid) showMessage();
  return !isNotValid;
}

const isValid = computed((): boolean => {
  const value = countryCode.value;
  if (!isSupportedCountry(value)) return false;
  if (!data.value) return false;
  const code = value as CountryCode;
  const asYouType = new AsYouType(code);
  asYouType.input(data.value);
  return asYouType.isValid();
});

defineExpose({
  validate,
  value: readonly(data),
  showClearedMessage
});
</script>
<style scoped>
/* .q-field:deep(.q-field__inner > .q-field__control):first-child { */
/* padding-left: 0px; */
/* } */
</style>
