import Vuex from "vuex";

export default new Vuex.Store({
  state: {
    currentAddress: "0x0000000000000000000000000000000000000000",
    chainId: "",
    contractData: null,
    userCoinBalance: 0,
    coinSymbol: "",
    notifications: [],
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
    setUserCoinBalance(state, data) {
      state.userCoinBalance = data;
    },
    setCoinSymbol(state, data) {
      state.coinSymbol = data;
    },
    push_notification(state, notification) {
      const isMessageUnique = state.notifications.findIndex(
        (el) => el.message.toLowerCase() === notification.message.toLowerCase()
      );
      if (isMessageUnique < 0) {
        state.notifications.push({
          ...notification,
          id: (Math.random().toString(36) + Date.now().toString(36)).substr(2),
        });
      }
    },
    clear_notifications(state, data) {
      state.notifications = data;
    },
    remove_notification(state, notificationToRemove) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id != notificationToRemove.id
      );
    },
  },
  actions: {},
  modules: {},
});
