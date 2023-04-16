import Vuex from "vuex";

export default new Vuex.Store({
  state: {
    currentAddress: "",
    chainId: 97,
    contractData: null,
  },
  mutations: {
    setCurrentAddress(state, data) {
      state.currentAddress = data;
    },
    setChainId(state, data) {
      state.chainId = data;
    },
    setContractData(state, data) {
      state.contractData = data;
    },
  },
  actions: {},
  modules: {},
});
