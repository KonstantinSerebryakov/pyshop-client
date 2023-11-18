<template>
  <q-layout view="lhr LpR lfr">
    <q-page-container>
      <router-view style="max-width: 400px" class="q-mx-auto q-my-none" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AuthLayout',
  components: {},
  setup(props, ctx) {
    return {};
  },
  methods: {},
  mounted() {
    console.log(this.$q.screen.gt);
  },
});
</script>
<style scoped></style>
