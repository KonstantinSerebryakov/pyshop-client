<template>
  <q-input
    v-model="data"
    label="About"
    type="textarea"
    :autogrow="true"
    outlined
    bottom-slots
    :maxlength="2600"
    input-style="max-height: 60vh; min-height: 100px"
    name="about"
  >
  </q-input>
</template>

<script setup lang="ts">
import { ABOUT_LENGTH_MAX } from '@app/constants';
import { readonly, ref } from 'vue';

const data = ref('');
const isValid = ref(true);

function validate(): boolean {
  const inputString = data.value;
  isValid.value = inputString.length <= ABOUT_LENGTH_MAX;
  return isValid.value;
}

function setValue(value: string) {
  data.value = value;
}
function clearValue() {
  data.value = '';
}
defineExpose({
  validate,
  value: readonly(data),
  setValue: setValue,
  clearValue: clearValue,
});
</script>
