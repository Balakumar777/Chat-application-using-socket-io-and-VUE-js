<template>
    <q-header elevated :class="!darkModeComputed ? 'bg-secondary' : 'bg-dark'" >
      <q-toolbar>
        <q-btn dense flat round :icon="!leftDrawerOpen ? 'menu' : 'close'" @click="drawerEvent()" v-if="checkRoute"/>
        <q-toolbar-title class="text-center">
          {{getUser.length && getUser[0]?.firstname != "" && checkRoute ? `${getUser[0]?.firstname}` : "Qchat"}}
          <q-badge class="q-ml-md" rounded color="green" v-if="getUser.length"/>
        </q-toolbar-title>

        <q-toggle v-model="darkMode" icon="mode_night"  @click="update()" class="float-right"  v-if="!checkRoute"/>
        <q-btn-dropdown v-if="checkRoute" flat dense dropdown-icon='settings'>
          <q-list>
            <q-item clickable @click="{darkMode = !darkMode;update();}">
              <q-item-section avatar>
                <q-icon :name="!darkModeComputed ? 'mode_night' : 'light_mode'" />
              </q-item-section>
              <q-item-section>
                 {{!darkModeComputed ? 'Dark mode' : 'Light mode' }} 
              </q-item-section>
            </q-item>
            <q-separator :dark="darkModeComputed" />
            <q-item clickable @click="logout()">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>
                Logout
              </q-item-section>
            </q-item>
            <q-separator :dark="darkModeComputed" />
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>
   

    <q-drawer  v-model="leftDrawerOpen" side="left" bordered :dark="darkModeComputed" v-if="checkRoute">
      <q-scroll-area class="fit" v-if="usersList.length">
          <q-input v-model="search" label="Search here..." :dark="darkModeComputed" class="q-mb-sm q-mt-sm" @keyup="filterUsers()">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <template v-for="(item, index) in usersList" :key="index">
            <q-item clickable  v-ripple @click="updateSelectedUser(item)" :active="this.$store.state.selectedId == item._id" :active-class="darkModeComputed ? 'bg-blue-grey-8 text' : 'bg-blue-grey-3 text'" class="userslist">
              <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>
                  {{ item?.firstname + " " +  item?.lastname}}
                </q-item-section>
                <q-item-section side top>
                  <q-badge rounded :color="availableUsers.includes(item._id) ? 'green' : 'grey'" />
                </q-item-section>
              </q-item>
            <q-separator :dark="darkModeComputed" />
          </template>
      </q-scroll-area>
      <div class="flex flex-center" v-if="!usersList.length" style="height:100%">
        No users in this space
      </div>
    </q-drawer>
</template>

<script>

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Header',
  data(){
    return{
      darkMode:this.$store.state.darkMode,
      leftDrawerOpen:true,
      menu:false,
      search:"",
      userList:[]
    }
  },
  methods:{
    update:function() {
      this.$store.dispatch('toggleTheme',this.darkMode)
    },
    logout:function() {
      this.$store.dispatch('LogOut',{router:this.$router,socket:this.$socket,id:this.$store.state?.loginUser[0]?._id})
    },
    drawerEvent:function(){
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    updateSelectedUser:function(data) {
      if(this.$store.state.selectedId != data._id) {
        const data1 = {
            config:{
                data:this.$queryString({id:this.$store.state?.loginUser[0]?._id,receiverId:data._id})
            },
            axios:this.$api,
        }
        this.search = "";
        this.filterUsers();
        this.$store.dispatch("getMessages",data1);
        this.$store.dispatch("updateSelectedId",data._id);
      }
    },
    filterUsers:function(){
      Object.values(document.querySelectorAll('.userslist')).forEach((data)=>{
        let text = data.querySelector('.q-item__section--main').innerHTML.toLowerCase();
        data.classList.remove('hidden');
        if(!text.includes(this.search.trim().toLowerCase())){
          data.classList.add("hidden");
        }
      })
    }
  },
  computed:{
    darkModeComputed:function(){
      return this.darkMode;
    },
    checkRoute:function() {
      return this.$router.currentRoute.value.fullPath == '/' || this.$router.currentRoute.value.fullPath == '/signup' ? false : true
    },
    availableUsers:function(){
      return this.$store.state.connectedUsers ?? [];
    },
    usersList:function() {
      return this.$store.state.allUsers ?? [];
    },
    getUser:function() {
      return this.$store.state.loginUser;
    }
  }
})
</script>
