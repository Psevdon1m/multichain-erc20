<script>
import NotificationList from './components/Notifications/NotificationList.vue';
import Core from '../src/core/core'
import { mapState } from "vuex"
import { switchNetwork, watchAccount, watchNetwork } from "@wagmi/core";
import { contractsAddresses } from '../config.js'
import { ethers } from 'ethers';
export default {
  data() {
    return {
      web3Modal: null,
      ethereumClient: null,
      address: null,
      balance: null
    }
  },
  components: {
    NotificationList
  },
  computed: {
    ...mapState(['currentAddress', 'contractData', 'chainId', 'userCoinBalance', 'coinSymbol']),
    getSupportedChains() {

      return this.contractData ? Object.keys(this.contractData) : []
    }
  },
  async mounted() {

    this.$root.core = new Core(this)

    const { web3modal, ethereumClient } = this.$root.core
    this.web3Modal = web3modal
    this.ethereumClient = ethereumClient
    const accountData = ethereumClient.getAccount()
    const { chain } = ethereumClient.getNetwork()

    if (chain) {
      this.$store.commit('setChainId', chain.id)
    }
    accountData && accountData.isConnected && accountData.address ? this.$store.commit('setCurrentAddress', accountData.address) : this.$store.commit('setCurrentAddress', "0x0000000000000000000000000000000000000000")
    const balance = await ethereumClient.fetchBalance({ address: this.currentAddress })
    this.$store.commit('setUserCoinBalance', parseFloat(Number(balance.formatted).toFixed(4)))
    this.$store.commit('setCoinSymbol', balance.symbol)
    await this.$root.core.fetchContractData(this.currentAddress)

    // const balance = await ethereumClient.fetchBalance(this.address)
    // this.balance = balance
    watchAccount(async (account) => {

      if (account) {

        this.$store.commit('setCurrentAddress', account.address)
        const balance = await ethereumClient.fetchBalance({ address: this.currentAddress })
        this.$store.commit('setUserCoinBalance', parseFloat(Number(balance.formatted).toFixed(4)))
        this.$store.commit('setCoinSymbol', balance.symbol)
        await this.$root.core.fetchContractData(this.currentAddress)
      } else {

        this.$store.commit('setCurrentAddress', "0x0000000000000000000000000000000000000000")
        await this.$root.core.fetchContractData(this.currentAddress)
      }

    })
    watchNetwork(async (chainId) => {

      if (chainId && chainId.chain) {
        this.$store.commit('setChainId', chainId.chain.id)
        const balance = await ethereumClient.fetchBalance({ address: this.currentAddress })
        this.$store.commit('setUserCoinBalance', parseFloat(Number(balance.formatted).toFixed(4)))
        this.$store.commit('setCoinSymbol', balance.symbol)

      } else {
        this.$store.commit('setChainId', "")
      }
      await this.$root.core.fetchContractData(this.currentAddress)
    })




  },
  methods: {
    getChainName(chainId) {
      if (this.$root.core) {

        return this.$root.core.chains.find(el => Number(el.id) === Number(chainId)).name

      }
      return chainId
    },
    async openModal() {

      await this.web3Modal.openModal()
    },
    async mint(chainDesired, amount) {

      if (Number(chainDesired) !== Number(this.chainId)) {

        try {
          await switchNetwork({
            chainId: Number(chainDesired)
          })
        } catch (error) {
          if (error.toString().includes("Connector not found")) {

            this.$store.commit("push_notification", {
              type: "error",
              typeClass: "error",
              message: `You need to connect your wallet first.`,
            });
            return;
          }
        }
      }

      await this.$root.core.writeContract("mint", this.chainId, [this.currentAddress, ethers.utils.parseEther(amount.toString())])

    },
    async burn(chainDesired, amount) {
      if (Number(chainDesired) !== Number(this.chainId)) {
        try {
          await switchNetwork({
            chainId: Number(chainDesired)
          })
        } catch (error) {
          if (error.toString().includes("Connector not found")) {

            this.$store.commit("push_notification", {
              type: "error",
              typeClass: "error",
              message: `You need to connect your wallet first.`,
            });
            return;
          }
        }
      }
      await this.$root.core.writeContract("burn", this.chainId, [ethers.utils.parseEther(amount.toString())])

    },

  },

}

</script>

<template>
  <div class="container">
    <NotificationList />
    <div v-if="currentAddress && currentAddress !== '0x0000000000000000000000000000000000000000'" class="info-row">
      <div class="info-item">
        <span class="info-label">Current Address:</span>
        <span class="info-value">{{ currentAddress }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Current Chain:</span>
        <span class="info-value">{{ getChainName(chainId) }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Current Balance:</span>
        <span class="info-value">{{ userCoinBalance }} {{ coinSymbol }}</span>
      </div>
    </div>
    <button class="connect-wallet-btn" @click="openModal()">{{ currentAddress && currentAddress
      !== '0x0000000000000000000000000000000000000000' ? "Wallet Details" : 'Connect Wallet' }}</button>
    <div class="button-row">
      <div v-for="chain in getSupportedChains" :key="chain">
        <div class="button-wrapper">
          <div class="chain-info">
            <h3 class="chain-name">{{ contractData[chain]?.name }}</h3>
            <ul class="chain-data-list">
              <li class="chain-data-item">Chain: {{ getChainName(chain) }}</li>
              <li class="chain-data-item">Symbol: {{ contractData[chain]?.symbol }}</li>
              <li class="chain-data-item">Total Supply: {{ contractData[chain]?.totalSupply }}</li>
              <li class="chain-data-item">Your Balance: {{ contractData[chain]?.balanceOf }}</li>
            </ul>
          </div>
          <div class="button-group">
            <button class="btn mint-btn" @click="mint(chain, 100)">Mint tokens</button>
            <button class="btn burn-btn" @click="burn(chain, 100)">Burn tokens</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: sans-serif;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.info-label {
  font-weight: bold;
  margin-bottom: 5px;
}

.connect-wallet-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.button-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 20px;
  border-radius: 8px;
  background-color: #2f2f2f;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

}

.chain-info {
  margin-top: 20px;
}

.chain-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.chain-data-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.chain-data-item {
  margin-bottom: 5px;
}


.button-group {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
}

.mint-btn {
  background-color: #28a745;
  color: #fff;
}

.burn-btn {
  background-color: #dc3545;
  color: #fff;
}

.btn:hover {
  opacity: 0.8;
}

@media (max-width: 600px) {
  .button-row {
    flex-direction: column;
  }

  .button-wrapper {
    width: 100%;
    margin: 10px 0;
  }
}
</style>


