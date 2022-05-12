const toggleTheme = (state, payload)=> {
    state.darkMode = payload;
}

const loading = (state, payload)=> {
    state.appLoading = payload;
}

const showAlert = (state, payload)=> {
    state.showAlert = payload.show;
    state.alertMessage = payload.message
}

const sessionEnds = (state, payload)=> {
    state.sessionEnds = payload;
}

const socketConnection = (state, payload)=> {
    state.socketConnected = payload;
}

const connectedUsers = (state, payload)=> {
    state.connectedUsers = payload;
}

const updateLoginUser = (state, payload)=> {
    state.loginUser = payload;
}

const allUsers = (state, payload)=> {
    state.allUsers = payload;
}

const messages = (state, payload)=> {
    if (!payload.newMsg) {
        state.message = [...state.message,payload.data];
    }
    else
        state.message = payload.data;
}

const typer = (state, payload)=> {
    state.typer = payload;
}

const updateSelectedId = (state, payload)=> {
    state.selectedId = payload;
}

export { toggleTheme, loading, showAlert, sessionEnds, socketConnection, connectedUsers, updateLoginUser, allUsers, messages, typer, updateSelectedId };