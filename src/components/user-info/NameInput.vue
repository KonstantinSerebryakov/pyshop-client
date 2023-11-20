<template>
  <q-input
    v-model="data"
    label="Name"
    type="text"
    outlined
    bottom-slots
    :maxlength="USERNAME_LENGTH_MAX"
    :clearable="true"
    name="name"
  >
  </q-input>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { USERNAME_LENGTH_MAX } from '@app/constants';

const data = ref(null as null | string);
const isValid = ref(true);

function validate(): boolean {
  const inputString = getValueString();
  isValid.value = inputString.length <= USERNAME_LENGTH_MAX;
  return isValid.value;
}

function getValueString(): string {
  return data.value?.toLowerCase().trim() ?? '';
}

function setValue(value: string | null) {
  data.value = value;
}
function clearValue() {
  data.value = null;
}

defineExpose({
  validate,
  value: computed(() => {
    return data.value?.trim() ?? null;
  }),
  setValue: setValue,
  clearValue: clearValue
});
</script>
