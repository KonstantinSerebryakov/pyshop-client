<template>
  <q-input
    v-model="data"
    label="About"
    type="textarea"
    :autogrow="true"
    outlined
    bottom-slots
    :error="isShowMessage"
    :maxlength="2600"
    input-style="max-height: 60vh; min-height: 100px"
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

const data = ref('');
const isShowMessage = ref(false);
const message = ref('');

watch(data, (newValue, oldValue) => {
  console.log(newValue);
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
  return data.value.toLowerCase().trim();
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
