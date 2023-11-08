<template>
  <q-select
    menu-anchor="bottom left"
    menu-self="top left"
    square
    :outlined="true"
    standout="bg-grey text-lg"
    :stack-label="false"
    :fill-input="true"
    :hide-bottom-space="true"
    color="primary"
    class="non-selectable ellipsis no-outline bg-grey-3"
    popup-content-style="height=16em; max-height=80vh; width: 200px"
    popup-content-class="text-bold non-selectable"
    v-model="selectedRef"
    :options="options"
    :clearable="false"
    :virtual-scroll-slice-size="15"
  >
    <template v-slot:selected>
      <q-avatar class="q-pl-none" square size="lg">
        <country-img :code="selectedRef" :is-square="false"></country-img>
      </q-avatar>
    </template>
    <template v-slot:option="scope">
      <q-item class="col-12" v-bind="scope.itemProps">
        <q-item-section avatar>
          <!-- <q-icon class="fis" :class="`fi-${scope.opt.toLowerCase()}`"></q-icon> -->
          <country-icon :code="scope.opt" :is-square="false"></country-icon>
        </q-item-section>
        <q-item-section>
          {{ scope.opt }}
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import CountryImg from 'src/components/user-info/CountryImg.vue';
import CountryIcon from 'src/components/user-info/CountryIcon.vue';
import { computed, onBeforeMount, readonly, ref, watch } from 'vue';
import { getCountries } from 'libphonenumber-js';
import { QSelect } from 'quasar';
import { useCountryTimeZoneComposable } from '../../composables/useTimeZoneComposable';

const props = defineProps({
  code: {
    type: String,
    validator: (value: string) => {
      // Allow an empty string or a valid two-letter code
      const regExp = new RegExp(/^$|^[A-Za-z]{2}$/);
      return regExp.test(value);
    }
  }
});

const emit = defineEmits(['selected']);

const countryCodes = getCountries();
const options: string[] = countryCodes.map((code) => code as string);

const selectedRef = ref(options[0]);
const propsCode = computed(() => {
  return props.code?.toUpperCase() ?? null;
});
watch(propsCode, (newValue, oldValue) => {
  if (newValue) {
    selectedRef.value = newValue;
  }
});
watch(selectedRef, (newValue, oldValue) => {
  if (newValue !== propsCode.value) {
    emit('selected', newValue);
  }
});

onBeforeMount(() => {
  const timeZone = useCountryTimeZoneComposable();
  selectedRef.value = timeZone.getIso2Code() ?? '';
});

defineExpose({
  selected: readonly(selectedRef)
});
</script>
<style scoped></style>
