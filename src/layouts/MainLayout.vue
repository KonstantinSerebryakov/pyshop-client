<template>
  <q-layout view="lHh Lpr lff">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          {{ data?.email ?? '' }}
        </q-toolbar-title>
        <div>
          <q-btn
            icon="logout"
            label="Logout"
            flat
            class="text-lowercase"
            @click="handleLogout"
          />
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view class="q-mx-auto q-my-none page full-height" />
    </q-page-container>
    <q-footer class="row bg-grey-4">
      <socials-footer class="footer q-mx-auto q-my-none"></socials-footer>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { EVENT_AUTH } from 'src/boot/event-bus';
import QMenuProfile from 'src/components/QListProfileMenu.vue';
import SocialsFooter from 'src/components/SocialsFooter.vue';
// import { UserEntity } from 'src/entities';
// import { getUserClonePromise } from 'src/stores/services/user-store.service';
import { useUserStore } from 'src/stores/user-store';
import { UserEntity } from 'src/utils/entities';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  // components: { QMenuProfile },
  name: 'MainLayout',
  setup() {
    const userStore = useUserStore();
    const data = userStore.$state.data;
    return { data };
  },
  methods: {
    handleLogout() {
      this.$eventBus.emit(EVENT_AUTH.LOGOUT_SUCCESS);
    }
  },
  computed: {},
  components: { SocialsFooter }
});
</script>
<style scoped lang="scss">
.page {
  max-width: $breakpoint-sm;
}
.footer {
  max-width: $breakpoint-sm;
  width: 100%;
}
</style>
