import { computed, readonly, ref } from 'vue';
import {
  AsYouType,
  CountryCode,
  getCountryCallingCode,
  getExampleNumber,
  isSupportedCountry,
  isValidPhoneNumber,
  parsePhoneNumber,
} from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';

export function useLibphonenumber() {
  const asYouType = ref(new AsYouType());
  const phoneNumber = ref(null as null | string);
  const countryCode = ref('' as string);

  const phonePrefix = computed(() => {
    const value = countryCode.value;
    if (isSupportedCountry(value)) {
      const code = value as CountryCode;
      return `+${getCountryCallingCode(code)}`;
    } else {
      return '+';
    }
  });

  const fullPhoneNumber = computed(() => {
    if (!phoneNumber.value) return null;
    return phonePrefix.value + phoneNumber.value;
  });

  const phoneLength = computed(() => {
    const maxLength = 15;
    const value = countryCode.value;
    if (!isSupportedCountry(value)) return maxLength;

    const code = value as CountryCode;
    const exampleNumber = getExampleNumber(
      code,
      examples
    )?.formatInternational();
    const variablePart = exampleNumber?.split(' ').slice(1).join('');
    return variablePart?.length ?? maxLength;
  });

  const isValidPhone = computed((): boolean => {
    if (!isSupportedCountry(countryCode.value)) return false;
    if (!phoneNumber.value) return true;
    asYouType.value.reset();
    asYouType.value.input(phoneNumber.value);
    return asYouType.value.isValid();
  });

  function setPhone(value: string | null) {
    if (!value) {
      phoneNumber.value = value;
      return;
    }
    if (!isValidPhoneNumber(value)) {
      return;
    }
    const number = parsePhoneNumber(value);
    const code = number.country;
    if (!code || !isSupportedCountry(code)) {
      return;
    }
    countryCode.value = code;
    phoneNumber.value = number
      .formatInternational()
      .split(' ')
      .slice(1)
      .join('');
  }

  function setCountryCode(code: string) {
    countryCode.value = code;
    if (isSupportedCountry(code)) {
      asYouType.value = new AsYouType(code);
    }
  }

  return {
    number: phoneNumber,
    prefix: phonePrefix,
    length: phoneLength,
    isValid: isValidPhone,
    countryCode: readonly(countryCode),
    setPhone: setPhone,
    setPhoneCountryCode: setCountryCode,
  };
}
