
<template>
    <div v-if="notifications.length" class="notification-list">
      <ul>
        <li v-for="notification in notifications" :key="notification.id">
         <Message  :notification="notification"/>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex';
import Message from './Message.vue';
  export default {
    components: {Message},
    computed: {
        ...mapState(["notifications"])
    }
  };
  </script>
  
  <style scoped>
.notification-list {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
}

.notification-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.notification-list li {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 10px;
    background-color: #333;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    z-index: 9999;
}
/* .notification-list li.success {
    background-color: #4caf50;
}
.notification-list li.warning {
    background-color: #ffbf00;
}
.notification-list li.error {
    background-color: #f44336;
    
} */
</style>








  