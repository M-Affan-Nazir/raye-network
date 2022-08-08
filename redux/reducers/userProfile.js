function addUserReducer (state={}, action) {
    switch(action.type){
        case "ADD_USER_PROFILE":
            const userData = action.userData
            return userData
        default:
            return state
    }
}

export default addUserReducer