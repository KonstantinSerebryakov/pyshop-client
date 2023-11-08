<template>
  <q-input
    v-model="data"
    label="Name"
    type="text"
    outlined
    bottom-slots
    :error="isShowMessage"
    :maxlength="USERNAME_LENGTH_MAX"
    :clearable="true"
  >
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
import { computed, readonly, ref, watch } from 'vue';
import { USERNAME_LENGTH_MAX } from '@app/constants';

const data = ref(null as null | string);
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

function getValueString(): string {
  return data.value?.toLowerCase().trim() ?? '';
}

const isValid = computed((): boolean => {
  const inputString = getValueString();
  return inputString.length < USERNAME_LENGTH_MAX;
});

defineExpose({
  validate,
  value: readonly(data),
  showClearedMessage
});
</script>
