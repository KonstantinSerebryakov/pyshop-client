<template>
  <q-img
    @error="setDefaultSrc"
    :src="src"
    :ratio="isSquare ? 1 / 1 : 4 / 3"
  ></q-img>
</template>

<script setup lang="ts">
import { QImg } from 'quasar';
import { computed, ref, watch } from 'vue';
const props = defineProps({
  code: {
    type: String,
    required: true,
    validator: (value: string) => {
      const regExp = new RegExp(/^[A-Za-z]{2}$/);
      return regExp.test(value);
    },
  },
  isSquare: {
    type: Boolean,
    default: false,
  },
});

const isDefaultSrc = ref(false);

function setDefaultSrc(e: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const typeError = e as Error;
  isDefaultSrc.value = true;
}

const countryCode = computed(() => props.code.toLocaleLowerCase());
// eslint-disable-next-line @typescript-eslint/no-unused-vars
watch(countryCode, (newValue, oldValue) => {
  isDefaultSrc.value = false;
});

const src = computed(() => {
  let src = 'flag-icons/';
  src += props.isSquare ? '1x1' : '4x3';
  src += '/';
  src += isDefaultSrc.value ? 'xx' : countryCode.value;
  src += '.svg';
  return src;
});
</script>
<style scoped></style>
