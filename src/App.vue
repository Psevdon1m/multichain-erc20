<script>
import Core from '../src/core/core'
import {mapState} from "vuex"
import {  switchNetwork, watchAccount, watchNetwork } from "@wagmi/core";
import { contractsAddresses }from '../config.js'
import { ethers } from 'ethers';
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
    ...mapState(['currentAddress', 'contractData', 'chainId']),
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
    const { chain } = ethereumClient.getNetwork()
    console.log(chain);
    this.$store.commit('setChainId', chain.id)
    accountData&&  accountData.isConnected && accountData.address ? this.$store.commit('setCurrentAddress', accountData.address) : this.$store.commit('setCurrentAddress', "0x0000000000000000000000000000000000000000")
    await this.$root.core.fetchContractData(this.currentAddress)
    this.$root.core.fetchContractDataInLoop(this.currentAddress);
    // const balance = await ethereumClient.fetchBalance(this.address)
    // this.balance = balance
    watchAccount(async (account) => {

      if(account){

        this.$store.commit('setCurrentAddress', account.address)
      }else {

        this.$store.commit('setCurrentAddress', "0x0000000000000000000000000000000000000000")
      }
      clearInterval(this.$root.core.fetchContractDataInterval)
    this.$root.core.fetchContractDataInLoop(this.currentAddress);
    })
    watchNetwork((chainId) => {
      console.log(chainId);
      if(chainId && chainId.chain){
        this.$store.commit('setChainId', chainId.chain.id)

      }else {
        this.$store.commit('setChainId', "")
      }
      clearInterval(this.$root.core.fetchContractDataInterval)
    this.$root.core.fetchContractDataInLoop(this.currentAddress);
    })
   



  },
  methods: {
   async openModal(){

      await this.web3Modal.openModal()
    },
    async mint(chainDesired,amount){
     
      if(Number(chainDesired) !== Number(this.chainId)){
        console.log({chainDesired, chainId:this.chainId});
        await switchNetwork({
          chainId: Number(chainDesired)
        })
      }
      
      await this.$root.core.writeContract("mint",this.chainId, [this.currentAddress, ethers.utils.parseEther(amount.toString())])

    },
    async burn(chainDesired,amount){
      if(Number(chainDesired) !== Number(this.chainId)){
        await switchNetwork({
          chainId: Number(chainDesired)
        })
      }
      await this.$root.core.writeContract("burn",this.chainId, [ethers.utils.parseEther(amount.toString())])

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
          <button class="btn" @click="mint(chain,100)">Mint tokens </button>
          <button class="btn" @click="burn(chain,100)">Burn Tokens </button>
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

