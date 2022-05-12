<template>
  <q-layout view="hHh lpR fFf" :class="darkModeComputed ? 'body--dark' : 'body--light'" class="q-pa-lg">
    <Header/>
    <q-page-container>
      <router-view/>
    </q-page-container>
    <Alert :message="message"/>
    <Loading/>
  </q-layout>
</template>

<script>

import { defineComponent } from 'vue';
import Loading from '../pages/Loading/index.vue';
import Header from '../pages/Header/index.vue'
import Alert from '../pages/Alert/index.vue'


export default defineComponent({
  name: 'MainLayout',
  computed:{
    darkModeComputed:function(){
      return this.$store.state.darkMode;
    },
    message:function() {
      return this.$store.state.message
    }
  },
  components:{
    'Loading':Loading,
    'Header':Header,
    'Alert':Alert
  },
  methods:{
    getRecords:function(){
      if(localStorage.getItem("id") != null) {
        this.$store.dispatch("getAllUsers",{axios:this.$api});
        this.$store.dispatch("updateUser",{config:{data:this.$queryString({id:localStorage.getItem("id")})},axios:this.$api,socket:this.$socket})
      }
    }
  },
  async mounted() {
    this.getRecords();
    await Notification.requestPermission();
  }
})
</script>
