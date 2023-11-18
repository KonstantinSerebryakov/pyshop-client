<template>
  <q-card class="bordered column" style="height: 400px; max-height: 80vh">
    <q-card-section class="q-pa-none col-auto full-width">
      <q-input
        v-model="address"
        label="Address"
        type="search"
        outlined
        :maxlength="255"
        :square="true"
        @keyup.enter="searchAddress"
      >
        <template v-slot:prepend>
          <q-icon name="place" class="" />
        </template>
        <template v-slot:append>
          <q-btn
            class="q-pa-nonee q-ma-none full-height"
            :flat="true"
            @click="searchAddress"
          >
            <q-icon name="search" class="" />
          </q-btn>
        </template>
      </q-input>
    </q-card-section>
    <q-card-section class="q-pa-none col full-width">
      <div ref="mapRef" class="full-height"></div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, onUnmounted, readonly, ref } from 'vue';
import { Emitter, EventType } from 'mitt';
import { EVENT_MAP, useYMap } from '../../composables/ymap/useYMap';
import { EVENT_USER_INFO_STORE, eventBus } from 'src/boot/event-bus';
const mapRef = ref(null as null | HTMLElement);
const address = ref('');
const mapEmitter = ref(null as null | Emitter<Record<EventType, unknown>>);
const emit = defineEmits(['picked']);

const props = defineProps({
  defaultValue: {
    type: String
  }
});

function searchAddress() {
  mapEmitter.value?.emit(EVENT_MAP.ADDRESS_CHANGED, address.value);
}

onMounted(() => {
  if (mapRef.value) {
    const htmlElement: HTMLElement = mapRef.value;
    useYMap(htmlElement, props.defaultValue)
      .then((payload) => {
        const emitter = payload.emitter;
        mapEmitter.value = emitter;
        return emitter;
      })
      .then((emitter) => {
        emitter.on(EVENT_MAP.ADDRESS_FETCHED, (data) => {
          address.value = data as string;
        });
      });
  }
});

onBeforeUnmount(() => {
  emit('picked', address.value);
});
onUnmounted(() => {
  mapEmitter.value?.emit('destroy');
});
defineExpose({ address: readonly(address) });
</script>
<style scoped>
:deep(.q-field > .q-field__inner > .q-field__control) {
  /* background-color: red; */
  padding-right: 0px;
}
</style>
