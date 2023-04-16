import Vuex from "vuex";

export default new Vuex.Store({
  state: {
    currentAddress: "",
  },
  mutations: {
    setCurrentAddress(state, data) {
      state.currentAddress = data;
    },
  },
  actions: {},
  modules: {},
});
