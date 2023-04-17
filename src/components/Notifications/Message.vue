
<template>
    <div :class="[notification.typeClass]">
      <div>{{ notification.message }}</div>
      <button class="close-btn" @click="closeNotif()">X</button>
    </div>
  </template>
  
  
  <script>
import { mapMutations } from 'vuex';

  export default {
    data(){
        return{
            timeout: null
        }
    },
    props:["notification"],
    created() {
        this.timeout = setTimeout(() => {
                    this.remove_notification(this.notification);
                }, 5000);
        },
    methods: {
        ...mapMutations(["remove_notification"]),

      closeNotif() {
                this.remove_notification(this.notification);
            },
    },

        beforeDestroy() {
            clearTimeout(this.timeout);
        },
  };
  </script>
  
  <style>
  
</style>

  
  
  
  
  
  