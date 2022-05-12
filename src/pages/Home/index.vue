<template>
    <div class="text chatContainer" :style="{height:chatHeight}" v-if="selectedId !=''" >
      <template v-if="messages.length">
        <div v-for="(item,index) in  messages" :key="index">
          <q-chat-message
            v-if="item.id == selectedId || item.receiverId == selectedId" 
            :name="item.name.split('@')[0]"
            :avatar="getUser[0]?._id == item.id ? 'sender.jpg' : 'receiver.jpg'"
            :text="[item.message]"
            :sent = "getUser[0]?._id == item.id"
            :stamp = "item.stamp"
          >
          </q-chat-message>
        </div>
      </template>
      <template v-else>
        <div class="flex flex-center text" :style="{height:chatHeight}" >
          <h5>
            <q-icon name="waving_hand" size="lg"/>
            Say hi to start conversation
          </h5>
        </div>
      </template>
    </div>
    <div  v-if="selectedId !=''">
      <q-input
        :dark = "darkMode"
        placeholder="Say something and enter..."
        @keyup.enter="sendMessage()"
        v-model="msg"
        @keyup="sendTyper()"
      >
        <template v-slot:append>
          <q-avatar>
            <q-btn flat dense  @click="sendMessage()" :disable="msg.trim() == ''">
              <q-icon name="send"/>
            </q-btn>
          </q-avatar>
        </template>
      </q-input>
      <label class="text" v-if="Object.keys(typer).length && typer.id != getUser[0]?._id && typer.id == selectedId">{{typer.name.split('@')[0]}} is typing</label>
    </div>
    <div class="flex flex-center text" :style="{height:chatHeight}"  v-if="selectedId ==''">
      <label>Select user on the left side to start conversation</label>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Home',
      data(){
        return{
          chatHeight:window.innerHeight - 170+"px",
          msg:"",
        }
    },
    methods:{
        sendMessage:function(){
          if(this.msg.trim() !=""){
            this.$socket.emit("message",JSON.stringify({name:this.getUser[0]?.username,id:this.getUser[0]?._id,stamp:new Date().toLocaleTimeString(),message:this.msg,receiverId:this.selectedId}));
            this.$socket.emit("typing",JSON.stringify({}));
            this.msg = "";
          } 
        },
        sendTyper:function() {
          if(this.msg.trim() !=""){
            this.$socket.emit("typing",JSON.stringify({name:this.getUser[0]?.username,id:this.getUser[0]?._id,stamp:new Date().toLocaleTimeString(),message:this.msg,receiverId:this.selectedId}));
          } else{
            this.$socket.emit("typing",JSON.stringify({}));
          }
        },
        callme:function() {
          
        }
    },
    computed: {
        darkMode () {
            return this.$store.state.darkMode;
        },
        messages() {
          return this.$store.state.message;
        },
        getUser:function() {
          return this.$store.state.loginUser;
        },
        selectedId:function() {
          return this.$store.state.selectedId;
        },
        typer:function() {
          return this.$store.state.typer;
        }
    },
    mounted(){
      window.addEventListener("resize",()=>{
        this.chatHeight = window.innerHeight - 170+"px";
      })
    },
    unmounted(){
      this.$store.commit("messages",{data:[],newMsg:true})
      this.$store.commit("updateSelectedId","")
    }
})
</script>