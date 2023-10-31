<template>
  <q-page class="q-pt-md">
    <div class="q-mx-auto" style="max-width: 600px">
      <q-card class="col-12 q-pa-md">
        <div class="text-h5">Name</div>
        <q-input
          v-model="data.name"
          label="Name"
          outlined
          bottom-slots
          :error="true"
          :maxlength="255"
        >
          <template v-slot:error>
            <span class="">
              {{ 'err' }}
            </span>
          </template>
        </q-input>

        <!--
          name?: string | null;
          <q-input></q-input>
          phone?: string | null;
          <q-input></q-input> with phone mask
          address?: string | null;
          <yandex map + q-input>
          about?: string | null;
          <text-area></text-area>
        -->
        <q-card-actions>
          <q-btn label="submit changes"></q-btn>
          <q-btn label="reset changes"></q-btn>
          <q-btn label="clear info"></q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { UserInfoEntity } from 'src/utils/entities';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const data = ref(UserInfoEntity.Empty);
    return { data };
  }
});
</script>
