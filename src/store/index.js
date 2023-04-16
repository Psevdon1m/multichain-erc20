import Vuex from "vuex";

export default new Vuex.Store({
  state: {
    currentAddress: "",
    contractData: null,
  },
  mutations: {
    setCurrentAddress(state, data) {
      state.currentAddress = data;
    },
    setContractData(state, data) {
      state.contractData = data;
    },
  },
  actions: {},
  modules: {},
});
