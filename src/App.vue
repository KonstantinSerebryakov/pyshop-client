<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});
</script>
<style>
/* body {
  overflow-y: scroll;
} */
.q-body--dialog {
  overflow-y: scroll;
}
</style>
