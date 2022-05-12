<template>
  <q-page class="row">
      <div class="col-xs-12 col-sm-12 col-md-4"></div>
      <div class="col-xs-12 col-sm-12 col-md-4">
        <q-form @submit.prevent="submitSignUp()">
            <h3 class="text text-center">Signup</h3>
            <q-input v-model="firstname" label="FirstName" :dark="darkMode" :rules="[ val => val && val.trim() != '' || 'Firstname should not be empty']" clearable />
            <q-input v-model="lastname" label="LastName" :dark="darkMode" :rules="[ val => val && val.trim() != '' || 'Lastname should not be empty']" clearable/>
            <q-option-group
                :options="genderOptions"
                type="radio"
                v-model="gender"
                :dark="darkMode"
                class="text radiogroup"
            />
            <q-input v-model="phone" label="Phone" :dark="darkMode" :rules="[ val => val && val.trim() != '' && /\d{10}/.test(val.trim()) || 'Invalid phone number']" clearable maxlength="10"/>
            <q-input v-model="username" label="Email" :dark="darkMode" :rules="[ val => val && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Enter valid email']" clearable/>
            <q-input v-model="password" label="Password" :dark="darkMode" :rules="[ val => val && val.length >= 5 || 'password should be atleast 5 characters']"  type="password" clearable/>
            <q-input v-model="cPassword" label="Confirm password" :dark="darkMode" :rules="[ val => val && val.length >= 5 && val === password || 'password mismatch']" type="password" clearable/>
            <q-btn color="primary" label="Signup" class="q-mt-md" type="submit"/>
            <q-btn color="secondary" label="Login" class="q-ml-md q-mt-md" @click="this.$router.push('/')"/>
        </q-form>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4"></div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Signup',
  data(){
      return{
          username:"",
          password:"",
          cPassword:"",
          message:"",
          firstname:"",
          lastname:"",
          genderOptions:[
              {label:"Male",value:1},
              {label:"FeMale",value:2},
              {label:"Others",value:3}
          ],
          gender:1,
          phone:""
      }
  },
  methods:{
      submitSignUp:async function(){
            const data = {
                config:{
                    data:this.$queryString({
                        username:this.username,
                        password:this.password,
                        firstname:this.firstname,
                        lastname:this.lastname,
                        gender:this.gender,
                        phone:this.phone
                    })
                },
                axios:this.$api,
                socket:this.$socket
            }
            this.$store.dispatch("Signup",data);
            this.username = "";
            this.password = "";
            this.cPassword = "";
            this.firstname = "";
            this.lastname = "";
            this.gender = "";
            this.phone = "";
      }
  },
  computed: {
    darkMode () {
        return this.$store.state.darkMode;
    }
},
})
</script>
