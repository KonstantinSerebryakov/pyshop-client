<template>
  <div>
    <div class="col-12 col-sm-4">
      <q-list class="">
        <q-item class="q-pa-none">
          <q-btn
            flat
            label="LinkedIn"
            :align="'left'"
            color="black"
            :href="'https://www.linkedin.com/in/konstantinserebryakov/'"
            target="_blank"
            icon="img:icons/linkedin.png"
            icon-right="open_in_new"
          ></q-btn>
        </q-item>
        <q-item class="q-pa-none">
          <q-btn
            flat
            label="GITHUB"
            :align="'left'"
            :href="'https://github.com/KonstantinSerebryakov?tab=repositories'"
            target="_blank"
            icon-right="open_in_new"
            color="black"
            icon="img:icons/github.png"
          ></q-btn>
        </q-item>
        <q-item class="q-pa-none">
          <q-btn
            flat
            label="TELEGRAM"
            :align="'left'"
            :href="'https://t.me/KonstantinSerebryakov'"
            target="_blank"
            icon-right="open_in_new"
            icon="img:icons/telegram.png"
            color="black"
          ></q-btn>
        </q-item>
      </q-list>
    </div>
    <div class="col-12 text-black" color="black">
      <span class="float-right">
        &copy;Created by Konstantin Serebryakov
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
      >
    </div>
  </div>
</template>
<script setup></script>
