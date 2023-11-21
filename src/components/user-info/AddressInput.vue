<template>
  <q-input
    class="col"
    v-model="data"
    label="Address"
    type="text"
    outlined
    bottom-slots
    :maxlength="ADDRESS_LENGTH_MAX"
    :readonly="false"
    :clearable="true"
    name="address"
  >
    <template v-slot:before>
      <q-btn class="full-height q-py-none q-pl-xs" @click="isShowMap = true">
        <q-icon name="map" class="clickable" size="md" />
        <span>map</span>
      </q-btn>
    </template>
    <template v-slot:prepend>
      <q-icon name="place" class="clickable" />
    </template>
  </q-input>
  <q-dialog v-model="isShowMap" class="" :maximized="true">
    <div style="width: 600px; max-width: 80vw; max-height: 80vh">
      <div class="absolute-top-right">
        <q-btn icon="close" flat round dense v-close-popup />
      </div>
      <y-map
        class="col-12 full-height"
        style="
          width: 600px;
          max-width: 80vw;
          max-height: 80vh;
          height: 400px;
          max-height: 80vh;
        "
        :default-value="data ?? undefined"
        @picked="handlePickAddressEvent"
      ></y-map>
    </div>
  </q-dialog>
</template>
<script setup lang="ts">
import YMap from './ymap/YMap.vue';
import { computed, ref } from 'vue';
import { ADDRESS_LENGTH_MAX } from '@app/constants';

const data = ref(null as null | string);
const isShowMap = ref(false);
const isValid = ref(true);

function handlePickAddressEvent(payload: unknown) {
  const address = payload as string;
  data.value = address;
}

function validate(): boolean {
  const inputString = getValueString();
  isValid.value = inputString.length <= ADDRESS_LENGTH_MAX;
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
  clearValue: clearValue,
});
</script>
