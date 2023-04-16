<script>
import Core from '../src/core/core'
import {mapState} from "vuex"
import {  watchAccount } from "@wagmi/core";
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
    ...mapState(['currentAddress'])
  },
  async mounted(){
    console.log(this.$store)
    const {web3modal,ethereumClient} = new Core(this)
    this.web3Modal = web3modal
    this.ethereumClient = ethereumClient
    const accountData = ethereumClient.getAccount()
    console.log({accountData});
    console.log(ethereumClient);
    
    accountData&&  accountData.isConnected && accountData.address ? this.$store.commit('setCurrentAddress', accountData.address) : this.$store.commit('setCurrentAddress', "")
    // const balance = await ethereumClient.fetchBalance(this.address)
    // this.balance = balance
    watchAccount((account) => {
      console.log({account});
      if(account){

        this.$store.commit('setCurrentAddress', account.address)
      }else {

        this.$store.commit('setCurrentAddress', "")
      }
    })


  },
  methods: {
   async openModal(){
    console.log(this);
      await this.web3Modal.openModal()
    }
  },
  watch: {
  
  }
}

</script>

<template>
 <div>

  <button @click="openModal()">{{ currentAddress ? "Wallet Details" : 'Connect Wallet' }}</button>
 </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
