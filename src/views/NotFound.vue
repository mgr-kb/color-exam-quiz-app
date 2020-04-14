<template>
  <div>
    <h1 class="text-center title">ページが存在しません</h1>
    <v-card class="pa-4 mx-auto text-center" max-width="360">
      <router-link to="/" style="text-decoration: none">
        <v-btn>
          TOPへ
        </v-btn>
      </router-link>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Not Found"
});
</script>
