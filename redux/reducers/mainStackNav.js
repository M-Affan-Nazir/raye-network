function addMainStackNav(state={}, action) {
    switch(action.type){
        case "ADD_MAIN_STACK_NAV":
            const nav = action.nav
            return nav
        default:
            return state
    }
}

export default addMainStackNav