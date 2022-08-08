import React,{useLayoutEffect} from 'react'
import DebateScreen3 from './debateScreen3'
import { io } from "socket.io-client";
import ip from "../constants"

export const SocketContext = React.createContext()

export default function HolderDebate(x) {

    const socket = io(ip+":3000")

    useLayoutEffect(()=>{
        x.navigation.setOptions({title: x.route.params.screenName })
        socket;
        socket.emit("joinRoom",x.route.params.dbCollectionChat)
    })

    return(
        <SocketContext.Provider value={socket} >
            <DebateScreen3 
                screenName = {x.route.params.screenName}
                dbCollectionChat = {x.route.params.dbCollectionChat}
                parentNav={x.navigation}
            />
        </SocketContext.Provider>
    )

}