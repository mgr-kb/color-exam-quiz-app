import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    mode: false,
    quizNum: 10,
    answeredColorDataList: [] as string[]
  },
  mutations: {
    setMode(state, { mode }) {
      state.mode = mode;
    },
    setQuizNum(state, { quizNum }) {
      state.quizNum = quizNum;
    },
    pushAnsewered(state, { colorData }) {
      state.answeredColorDataList.push(colorData);
    }
  }
});
