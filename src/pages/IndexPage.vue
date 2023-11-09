<template>
  <q-page class="q-pt-md q-pb-md">
    <div class="q-mx-auto" style="max-width: 600px">
      <q-card class="col-12 q-pa-md">
        <div class="text-h5">Name</div>
        <name-input></name-input>
        <div class="text-h5">Phone</div>
        <phone-input></phone-input>
        <div class="text-h5">Address</div>
        <address-input></address-input>
        <div class="text-h5">About</div>
        <about-input></about-input>
        <q-card-actions>
          <q-space></q-space>
          <q-btn label="submit" class=""></q-btn>
          <q-btn label="undo" class=""></q-btn>
          <q-btn label="delete" class="bg-negative"></q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import NameInput from 'src/components/user-info/NameInput.vue';
import PhoneInput from 'src/components/user-info/PhoneInput.vue';
import AboutInput from 'src/components/user-info/AboutInput.vue';
import { UserInfoEntity } from 'src/utils/entities';
import { defineComponent, ref } from 'vue';
import AddressInput from 'src/components/user-info/AddressInput.vue';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const data = ref(UserInfoEntity.Empty);

    return { data };
  },
  methods: {},
  components: { NameInput, PhoneInput, AboutInput, AddressInput }
});
</script>
