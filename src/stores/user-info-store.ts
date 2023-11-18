import { defineStore } from 'pinia';
import {
  EVENT_USER_INFO_STORE,
  UserInfoApi,
} from 'src/utils/api/user-info.api';
import { UserInfoEntity } from 'src/utils/entities';
import { ref } from 'vue';

export const useUserInfoStore = defineStore('user_info', () => {
  const _data = ref(null as UserInfoEntity | null);
  const _userId = ref(null as null | string);
  const _id = ref(null as null | string);
  const _api = new UserInfoApi();

  function clear() {
    _data.value = null;
  }
  function setKeys(userId: string | null = null, id: string | null = null) {
    _userId.value = userId;
    _id.value = id;
    _api.setup(userId, id);
  }

  _api.emitter.on(EVENT_USER_INFO_STORE.FETCHED, (payload) => {
    const entity = payload;
    _data.value = entity;
    setKeys(entity.userId ?? null, entity.id ?? null);
  });
  _api.emitter.on(EVENT_USER_INFO_STORE.UPDATED, (payload) => {
    const entity = payload;
    _data.value = entity;
    setKeys(entity.userId ?? null, entity.id ?? null);
  });
  _api.emitter.on(EVENT_USER_INFO_STORE.DELETED, (payload) => {
    const entity = payload;
    _data.value = entity;
  });

  return { data: _data, api: _api, clear: clear, setKeys: setKeys };
});
