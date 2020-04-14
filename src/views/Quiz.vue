<template>
  <div>
    <div v-if="done">
      <h1 class="text-center title">結果発表</h1>
      <v-card class="pa-4 mx-auto text-center" max-width="360">
        <p>お疲れ様でした！</p>
        <p>正解数は{{ correctCount }} / {{ quizNum }}でした！</p>
        <router-link to="/" style="text-decoration: none">
          <v-btn>
            TOPへ
          </v-btn>
        </router-link>
      </v-card>
    </div>
    <div v-else>
      <h1 class="text-center title">
        Q.この色の"{{ routeJp }}"を選択して下さい。
      </h1>
      <p class="text-center">回答数: {{ nowCount }} / {{ quizNum }}</p>
      <v-card
        :style="{ backgroundColor: correctData.colorCode }"
        width="60"
        height="60"
        class="mx-auto pa-4 ma-2"
      >
      </v-card>
      <v-card class="mx-auto" max-width="360">
        <v-card-actions>
          <ul class="mx-auto">
            <li
              class="v-list d-xs-pa-1  d-sm-pa-2"
              v-for="item in choiceColors"
              :key="item.colorName"
            >
              <v-btn
                :disabled="answered"
                @click="answer(item.colorName)"
                :class="[choiceName === item.colorName ? 'active' : '']"
                width="240"
                :small="true"
              >
                {{ item[route] }}
              </v-btn>
            </li>
          </ul>
        </v-card-actions>
        <div v-if="answered" class="d-xs-pa-2">
          <div v-if="correctStatus">
            <p class="bold red--text body-2">正解!</p>
          </div>
          <div v-else>
            <p class="bold blue--text body-2">不正解...</p>
          </div>
          <ul class="caption">
            <li class="v-list d-xs-pa-1 d-sm-pa-2">
              【カラーコード】 {{ correctData.colorCode }}
            </li>
            <li class="v-list d-xs-pa-1 d-sm-pa-2">
              【カラーネーム】 {{ correctData.colorName }}
            </li>
            <li class="v-list d-xs-pa-1 d-sm-pa-2">
              【別名】 {{ correctData.colorAlias }}
            </li>
            <li class="v-list d-xs-pa-1 d-sm-pa-2">
              【系統色名】 {{ correctData.systemColorName }}
            </li>
            <li class="v-list d-xs-pa-1 d-sm-pa-2">
              【マンセル値】 {{ correctData.munsellValue }}
            </li>
          </ul>
          <div class="text-center pa-2">
            <v-btn @click="next" :small="true">次へ</v-btn>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import data from "@/data/data.json";

interface ColorData {
  colorCode: string;
  colorName: string;
  colorAlias: string;
  systemColorName: string;
  munsellValue: string;
  colorGroup: string;
}

export default Vue.extend({
  data() {
    return {
      correctData: {} as ColorData,
      choiceColors: [] as ColorData[],
      choiceName: "" as string,
      answered: false as boolean,
      remainningCount: 10,
      nowCount: 1,
      correctCount: 0,
      correctStatus: false,
      done: false
    };
  },
  created() {
    // 初期化
    this.answered = false;
    // 残り問題数をセット
    this.remainningCount = this.$store.state.quizNum;
    // 違うmodeが選択されていたらリダイレクト
    switch (this.$store.state.mode) {
      case "colorName":
      case "systemColorName":
      case "munsellValue":
        break;
      default:
        this.$router.push("/");
    }
    // 問題をセット
    this.refleshQuiz();
  },
  computed: {
    route(): string {
      return this.$store.state.mode;
    },
    routeJp(): string {
      switch (this.route) {
        case "colorName":
          return "色名";
        case "systemColorName":
          return "系統色名";
        case "munsellValue":
          return "マンセル値(HV/C)";
        default:
          return "";
      }
    },
    quizNum(): number {
      return this.$store.state.quizNum;
    }
  },
  methods: {
    answer(colorName: string) {
      this.answered = true;
      this.choiceName = colorName;
      if (this.correctData.colorName === colorName) {
        this.correctStatus = true;
        this.correctCount += 1;
      } else {
        this.correctStatus = false;
      }
    },
    next(): void {
      this.answered = false;
      this.choiceName = "";
      this.nowCount += 1;
      // 回答したデータを回答済のリストに入れる
      this.$store.commit("pushAnsewered", { colorData: this.correctData });
      // 残り問題数の計算。終わっていたら結果を出す
      this.remainningCount -= 1;
      if (this.remainningCount === 0) {
        this.done = true;
        return;
      }
      // 新しい問題をセットする
      this.refleshQuiz();
    },
    // TODO 答えと同じグループのものからコードをランダムで3つ選定したいなあというお気持ち
    refleshQuiz(): void {
      // 回答済でないものから答えのコードを選定, セット
      const answeredColorDataList = this.$store.state.answeredColorDataList;
      let questionArray = data.twoClass.filter(item => {
        return !answeredColorDataList.includes(item);
      });

      // 問題をランダムに並べ替え
      questionArray = this.randomSort(questionArray);

      // 正解を設定
      const correctIndex = Math.floor(
        Math.random() * Math.floor(questionArray.length - 1)
      );
      this.correctData = questionArray[correctIndex];

      // 選択肢をランダムに設定
      this.choiceColors = [];
      const correctIndexes = this.getCorrectIndex(
        correctIndex,
        questionArray.length
      );
      this.choiceColors.push(questionArray[correctIndexes[0]]);
      this.choiceColors.push(questionArray[correctIndexes[1]]);
      this.choiceColors.push(questionArray[correctIndexes[2]]);
      this.choiceColors.push(questionArray[correctIndexes[3]]);
      this.choiceColors = this.randomSort(this.choiceColors);
    },
    getCorrectIndex(correctIndex: number, arrayLength: number): number[] {
      const correctIndexes: number[] = [];
      for (let i = 0; i < 4; i++) {
        if (correctIndex + i < arrayLength) {
          correctIndexes.push(correctIndex + i);
        } else {
          correctIndexes.push(i);
        }
      }
      return correctIndexes;
    },
    randomSort<T>(array: T[]): T[] {
      let i = array.length - 1;
      while (i) {
        const randomIdx = Math.floor(Math.random() * i);
        const k = array[i];
        array[i] = array[randomIdx];
        array[randomIdx] = k;
        i -= 1;
      }
      return array;
    }
  }
});
</script>

<style>
.active {
  box-shadow: 6px 6px rgba(180, 180, 180, 0.8);
}
</style>