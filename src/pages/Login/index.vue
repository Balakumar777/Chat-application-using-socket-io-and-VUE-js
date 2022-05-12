<template>
  <q-page class="row">
      <div class="col-xs-12 col-sm-12 col-md-4"></div>
      <div class="col-xs-12 col-sm-12 col-md-4">
        <q-form @submit.prevent="submitLogin()">
            <h3 class="text text-center">Login</h3>
            <q-input v-model="username" label="Email" :dark="darkMode" :rules="[ val => val && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Enter valid email']" clearable/>
            <q-input v-model="password" label="Password" :dark="darkMode" :rules="[ val => val && val.length >= 5 || 'password should be atleast 5 characters']" type="password" clearable/>
            <q-btn color="primary" label="Login" class="q-mt-md" type="submit"/>
            <q-btn color="secondary" label="Signup" class="q-ml-md q-mt-md" @click="this.$router.push('/signup')"/>
        </q-form>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4"></div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Login',
        data(){
            return{
                username:"",
                password:"",
                message:""
            }
    },
    methods:{
        submitLogin:async function() {
            const data = {
                config:{
                    data:this.$queryString({
                        username:this.username,
                        password:this.password,
                    })
                },
                axios:this.$api,
                socket:this.$socket,
                router:this.$router
            }
            this.$store.dispatch("Login",data);
            this.username = "";
            this.password = "";
        }  
    },
    computed: {
        darkMode () {
            return this.$store.state.darkMode;
        }
    },
    mounted(){
        if(localStorage.getItem("id") != null) {
            this.$socket.emit("removeUser",localStorage.getItem("id"))
        }
        localStorage.clear();
    }
})
</script>
