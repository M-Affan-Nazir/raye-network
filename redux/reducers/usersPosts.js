function addUsersPosts (state={}, action) {
    switch(action.type){
        case "ADD_USERS_POSTS":
            const usersPosts = action.usersPosts
            return usersPosts
        default:
            return state
    }
}

export default addUsersPosts