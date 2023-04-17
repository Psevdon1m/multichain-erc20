import Vuex from "vuex";

export default new Vuex.Store({
  state: {
    currentAddress: "0x0000000000000000000000000000000000000000",
    chainId: "",
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
