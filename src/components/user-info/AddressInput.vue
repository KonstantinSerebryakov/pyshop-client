<template>
  <q-input
    class="col"
    v-model="data"
    label="Address"
    type="text"
    outlined
    bottom-slots
    :maxlength="USERNAME_LENGTH_MAX"
    :readonly="false"
    :clearable="true"
  >
    <template v-slot:before>
      <q-btn class="dense" @click="isShowMap = true">Pick address</q-btn>
    </template>
    <template v-slot:prepend>
      <q-icon name="place" class="clickable" />
    </template>
  </q-input>
  <q-dialog v-model="isShowMap" class="" :maximized="true">
    <y-map
      class="col-12"
      style="width: 600px; max-width: 80vw; max-height: 80vh"
    ></y-map>
  </q-dialog>
</template>
<script setup lang="ts">
import {
  computed,
  onBeforeMount,
  onMounted,
  onUnmounted,
  readonly,
  ref,
  watch
} from 'vue';
import { USERNAME_LENGTH_MAX } from '@app/constants';
import YMap from '../user-info/YMap.vue';
import { EVENT_USER_INFO_STORE, eventBus } from 'src/boot/event-bus';

const data = ref(null as null | string);
const isShowMap = ref(false);

function handlePickAddressEvent(payload: unknown) {
  const address = payload as string;
  console.log(address);
  data.value = address;
}

onMounted(() => {
  eventBus.on(EVENT_USER_INFO_STORE.ADDRESS_PICKED, handlePickAddressEvent);
});
onUnmounted(() => {
  eventBus.off(EVENT_USER_INFO_STORE.ADDRESS_PICKED, handlePickAddressEvent);
});
defineExpose({});
</script>
