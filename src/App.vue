<script>
import Core from '../src/core/core'
import {mapState} from "vuex"
import {  watchAccount } from "@wagmi/core";
import { contractsAddresses }from '../config.js'
export default {
  data(){
    return{
      web3Modal: null,
      ethereumClient: null,
      address: null,
      balance: null
    }
  },
  computed: {
    ...mapState(['currentAddress', 'contractData']),
    getSupportedChains(){

      return this.contractData ? Object.keys(this.contractData) : []
    }
  },
  async mounted(){

    this.$root.core = new Core(this)

    const {web3modal,ethereumClient} = this.$root.core
    this.web3Modal = web3modal
    this.ethereumClient = ethereumClient
    const accountData = ethereumClient.getAccount()
    
    accountData&&  accountData.isConnected && accountData.address ? this.$store.commit('setCurrentAddress', accountData.address) : this.$store.commit('setCurrentAddress', "")
    // const balance = await ethereumClient.fetchBalance(this.address)
    // this.balance = balance
    watchAccount((account) => {

      if(account){

        this.$store.commit('setCurrentAddress', account.address)
      }else {

        this.$store.commit('setCurrentAddress', "")
      }
    })
    await this.$root.core.fetchContractData(this.currentAddress)



  },
  methods: {
   async openModal(){
    console.log(this);
      await this.web3Modal.openModal()
    },
    async mint(amount){
      await this.$root.core.mintTokens(amount)
    },
    async burn(amount){
      await this.$root.core.burnTokens(amount)
    },

  },
  watch: {
  
  }
}

</script>

<template>
  <div class="container">
    <button class="connect-wallet-btn" @click="openModal()">{{ currentAddress ? "Wallet Details" : 'Connect Wallet' }}</button>

    <div class="button-row">
      <div v-for="chain in getSupportedChains" :key="chain">
        <div class="button-wrapper">
          <button class="btn" @click="mint(100)">Mint tokens </button>
          <button class="btn" @click="burn(100)">Burn Tokens </button>
          <div class="chain-info">
            <ul>
              <li>ChainId: {{ chain }}</li>
              <li>Name: {{ contractData[chain]?.name }}</li>
              <li>Symbol: {{ contractData[chain]?.symbol }}</li>
              <li>Total Supply: {{ contractData[chain]?.totalSupply }}</li>
              <li>Your Balance: {{ contractData[chain]?.balanceOf }}</li>
            </ul>
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
  align-items: flex-end;
}

.connect-wallet-btn {
  position: absolute;
  top: 0;
  right: 0;
}

.button-row {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
}

.button-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
}

.btn {
  margin-bottom: 10px;
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

.chain-info {
  margin-top: 20px;

}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  margin-bottom: 5px;
}

</style>

