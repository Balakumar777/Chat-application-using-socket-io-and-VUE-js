import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { io } from 'socket.io-client';

const api = axios.create({ baseURL: 'http://localhost:8000/' ,headers: { 'content-type': 'application/x-www-form-urlencoded' }});

const queryStringApi = (params)=> {
  return Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
}

export default boot(({ app }) => {

  app.config.globalProperties.$api = api;
  
  app.config.globalProperties.$queryString = queryStringApi;

  app.config.globalProperties.$socket = io("http://localhost:8000");

  app.config.globalProperties.$socket.on("connected",(data)=>{
    if (data)
      app.config.globalProperties.$store.commit("socketConnection",data)
  });

  app.config.globalProperties.$socket.on("userJoined",(data)=>{
      app.config.globalProperties.$store.commit("connectedUsers",data)
    app.config.globalProperties.$store.dispatch("getAllUsers", { axios: api });
  });

  app.config.globalProperties.$socket.on("getUsers",(data)=>{
    app.config.globalProperties.$store.commit("connectedUsers",data)
  });

  app.config.globalProperties.$socket.on("message",(data)=>{
    let text = JSON.parse(data);
    let sendOrReceive = app.config.globalProperties.$store.state.loginUser;
    if (sendOrReceive.length) {
      sendOrReceive = sendOrReceive[0];
      if (text.receiverId == sendOrReceive?._id || text.id == sendOrReceive?._id) {
        const greeting = new Notification(text.name.split('@')[0], {
          body: text.message,
        });
        setTimeout(() => greeting.close(), 10 * 1000);
        app.config.globalProperties.$store.commit("messages", {data:text,newMsg:false})
      }
    }
  });

  app.config.globalProperties.$socket.on("typing",(data)=>{
    app.config.globalProperties.$store.commit("typer", JSON.parse(data))
  });

})

export { api }
