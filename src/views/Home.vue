<template>
  <v-card class="mx-auto" max-width="420">
    <h1 class="headline">色彩検定2級 JIS慣用色名</h1>
    <v-card-title>
      回答モードと問題数を選んでください
    </v-card-title>
    <v-img
      src="../assets/kid_job_girl_artist.png"
      max-width="80"
      class="mx-auto"
    ></v-img>
    <v-card-actions class="ma-2">
      <ul class="mx-auto px-0">
        <li class="v-list">
          <v-select :items="quizNum" label="回答数" v-model="selectQuizNum" />
        </li>
        <li class="v-list">
          <v-btn @click="setMode('colorName')" width="240" :small="true"
            >色名</v-btn
          >
        </li>
        <li class="v-list">
          <v-btn @click="setMode('systemColorName')" width="240" :small="true"
            >系統色名</v-btn
          >
        </li>
        <li class="v-list">
          <v-btn @click="setMode('munsellValue')" width="240" :small="true"
            >マンセル値(HV/C)</v-btn
          >
        </li>
      </ul>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Home",
  data() {
    return {
      selectQuizNum: 10,
      quizNum: [10, 20, 30, 40, 50]
    };
  },
  computed: {
    mode(): string {
      return this.$store.state.mode;
    }
  },
  methods: {
    setMode(mode: string): void {
      this.$store.commit("setMode", { mode });
      this.$store.commit("setQuizNum", { quizNum: this.selectQuizNum });
      this.$router.push(`/quiz/${this.$store.state.mode}`);
    }
  }
});
</script>
