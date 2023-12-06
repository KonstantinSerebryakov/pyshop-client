<template>
  <q-page class="q-pt-md q-pb-md">
    <div class="q-mx-auto" style="max-width: 600px"></div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from 'src/stores/user-store';
import { useRouter, useRoute } from 'vue-router';
import { JwtTokensService } from 'src/boot/util/tokens.service';
import { api } from 'src/boot/axios';
import { ApiService } from 'src/utils/api';
import { UserEntity } from 'src/utils/entities';
const router = useRouter();
const route = useRoute();

onMounted(() => {
  const refreshToken = router.currentRoute.value.query[
    'refresh_token'
  ] as string;
  const refreshTokenExp = Number.parseInt(
    router.currentRoute.value.query['exp'] as string
  );
  const userId = router.currentRoute.value.query['userid'] as string;
  if (!refreshToken || !refreshTokenExp) {
    // TODO:handle oauth fail?
    return;
  }

  const userStore = useUserStore();
  const iat = Math.floor(Date.now() / 1000);
  userStore.$state.refreshToken = {
    token: refreshToken,
    exp: refreshTokenExp,
    iat: iat
  };

  const payload = ApiService.abortableRequest({
    url: 'users/' + userId,
    method: 'GET'
  });
  payload.requestPromise
    .then((response) => {
      const status = response.status;
      const data = response.data;
      if (status === 200 && data) {
        userStore.$state.data = new UserEntity(data);
      }
    })
    .then(() => {
      router.push('/');
    });
  // const tokensService = new JwtTokensService().refreshTokens();
  // tokensService.then((a) => {
  //   router.push('/');
  // });
});
</script>
