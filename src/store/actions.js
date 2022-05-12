const toggleTheme = ({ commit }, payload)=> {
    commit('toggleTheme', payload);
}

const loading  = ({ commit }, payload)=> {
    commit('loading', payload);
}

const showAlert = ({ commit }, payload) => {
    commit('showAlert', payload);
}

const sessionEnds = ({ commit }, payload) => {
    if (payload.sessionEnds && payload.userId) {
        localStorage.setItem("userId", payload.userId)
        localStorage.setItem("sessionEnds", new Date(new Date().getTime() + 5 * 60000));
        commit('sessionEnds', payload.sessionEnds);
    }else{
        commit('sessionEnds', true);
    }
}

const socketConnection = ({ commit }, payload) => {
    commit("socketConnection",payload);
}

const connectedUsers = ({ commit }, payload) => {
    commit("connectedUsers",payload);
}

const getAllUsers = async({ commit }, payload) => {
    const { axios, socket, config, router } = payload;
    commit("loading", true);
    let res = await axios({ url: '/selectUser', method: "POST",});
    commit("loading", false);
    if (isJson(res?.data?.data)) {
        let data = JSON.parse(res?.data?.data);
        if (localStorage.getItem("id") != null) {
            data = data.filter((data) => data._id != localStorage.getItem("id"))
        }
        commit("allUsers", data)
    }
}

const Login = async ({ commit }, payload) => {
    const { axios, socket, config, router} = payload;
    commit("loading",true);
    let res = await axios({url: '/selectUser',method: "POST",...config});
    commit("loading", false);
    if (res?.data?.statusCode === 500) {
        commit("showAlert", { message: res.data?.message, show: true });
    } else {
        let user = isJson(res?.data?.data) && JSON.parse(res?.data?.data);
        if (user) {
            commit('updateLoginUser', user);
            console.log("user", user)
            socket.emit('userJoined', user[0]._id);
            localStorage.setItem("sessionEnds",new Date().getTime() + (5 * 60000))
            localStorage.setItem("id", user[0]._id)
            router.push("/home");
        }
    }
}

const updateUser = async ({ commit }, payload) => {
    const { axios, socket, config} = payload;
    commit("loading",true);
    let res = await axios({url: '/selectUserById',method: "POST",...config});
    commit("loading", false);
    if (res?.data?.statusCode === 500) {
        commit("showAlert", { message: res.data?.message, show: true });
    } else {
        let user = isJson(res?.data?.data) && JSON.parse(res?.data?.data);
        if (user) {
            commit('updateLoginUser', user);
            socket.emit('userJoined', user[0]._id);
        }
    }
}

const Signup = async ({ commit }, payload) => {
    const { axios, config} = payload;
    commit("loading",true);
    let res = await axios({ url: '/insertUser', method: "POST", ...config });
    commit("loading", false);
    let message =  res?.data?.statusCode === 200 ? "User added successfully" : res?.data?.message;
    commit("showAlert", { message: message,show:true});
}

const LogOut = async ({ commit }, payload) => {
    const { router, socket,id } = payload;
    socket.emit("removeUser", id)
    commit("updateLoginUser", {});
    commit("loading", false);
    localStorage.clear();
    router.push("/");
}

const isJson = (data)=>{
    try {
        JSON.parse(data)
    } catch (error) {
        return false;
    }
    return true;
}

const messages = async ({ commit }, payload) => {
    commit("messages", payload);
}

const typer = async ({ commit }, payload) => {
    commit("typer", payload);
}

const updateSelectedId = async ({ commit }, payload) => {
    commit("updateSelectedId", payload);
}

const getMessages = async ({ commit }, payload) => {
    const { axios, config  } = payload;
    commit("loading", true);
    let res = await axios({ url: '/selectUserMessages', method: "POST", ...config});
    commit("loading", false);
    if (isJson(res?.data?.data)) {
        let data = JSON.parse(res?.data?.data);
        commit("messages", {data:data,newMsg:true})
    }
}

export { toggleTheme, loading, showAlert, sessionEnds, socketConnection, connectedUsers, Login, Signup, getAllUsers, LogOut, updateUser, messages, typer, updateSelectedId, getMessages};