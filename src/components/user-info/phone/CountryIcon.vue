<template>
  <q-icon
    class="flag"
    :class="{ 'extended-width': !isSquare }"
    :name="`img:${src}`"
  ></q-icon>
</template>

<script setup lang="ts">
import { QIcon } from 'quasar';
import { computed, onBeforeMount, ref } from 'vue';
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

const isUseDefaultSrc = ref(false);
const countryCode = computed(() => props.code.toLocaleLowerCase());

const src = computed(() => {
  return `flag-icons/${props.isSquare ? '1x1' : '4x3'}/${
    isUseDefaultSrc.value ? 'xx' : countryCode.value
  }.svg`;
});

onBeforeMount(() => {
  // Note: validate icone image ref
  // const img = document.createElement('img');
  // img.addEventListener('error', (e: Event) => {
  //   isUseDefaultSrc.value = true;
  // });
  // img.src = src.value;
});
</script>
<style scoped>
.extended-width {
  width: calc(4 / 3 * 1em);
}
</style>
