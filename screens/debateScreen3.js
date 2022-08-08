import React,{useState, useLayoutEffect, useContext} from "react"
import { View,Text,Dimensions, TextInput,FlatList, Image, ActivityIndicator, TouchableOpacity, Keyboard} from "react-native"
import { authx} from '../db/firebase';
import { AntDesign } from '@expo/vector-icons';
import { io } from "socket.io-client";
import { SocketContext } from "./holderDebate";
import ip from "../constants"

const {width, height} = Dimensions.get("window")

export default function DebateScreen3(x) {

    const [messages, setMessages] = useState([])
    const [oMsg, setOMsg] = useState()
    const [flag,setFlag] = useState(false)
    const [fetched,setFetched] = useState(false)

    const fetcher = async () =>{
        const msg = await fetch(ip+":8000/getChats/"+x.dbCollectionChat)
        const strMsg = await msg.json()
        setMessages(strMsg)
        setFetched(true)
    }

    const socket = useContext(SocketContext);

    useLayoutEffect(()=>{
        if(!fetched){
            // x.navigation.setOptions({title: x.screenName })
            fetcher()
        }
    })

    
    if(!flag){
        // socket.emit("joinRoom",x.dbCollectionChat)
        setFlag(true)
    }



    socket.on("connect",()=>{
        console.log(socket.id)
    })

    socket.off("receiveMessage").on("receiveMessage", async (msg)=>{
        setMessages(messages=>[msg,...messages])
    })

    const sendMessage = () => {
        Keyboard.dismiss()
        if(oMsg){
            const messageTO = {
                text:oMsg,
                email:authx.currentUser.email,
                user:authx.currentUser.displayName,
                avatar:authx.currentUser.photoURL,
                uid: authx.currentUser.uid,
                createdAt:  ~~(+new Date() / 1000),
            }
            setMessages(messages=>[messageTO,...messages])
            socket.emit("sentMessage",messageTO,x.dbCollectionChat) 
            setOMsg("")       
        }
    }

    if(!fetched){
        return(
            <View style={{flex:1, backgroundColor:"white", alignItems:"center", justifyContent:"center"}}>
                <ActivityIndicator size="large" color="black" />
            </View>
        )
    } else {
        return (
            <View style={{flex:1, backgroundColor:"white"}}>
                <FlatList 
                    data={messages}
                    extraData={messages}
                    inverted={true}
                    renderItem={({item}) => {
                        return ( <GetS 
                                    text={item.text} 
                                    user={item.user}
                                    email={item.email}
                                    avatar={item.avatar}
                                    uid={item.uid}
                                />)
                    }}
                    keyExtractor={(item, index) => { return(index)}}
                />
                <View style={{marginBottom:20, paddingHorizontal:20, flexDirection:"row", marginTop:10}}> 
                    <TextInput 
                        placeholder="YOUR RAYE"
                        multiline
                        value={oMsg}
                        style={{borderColor:"grey",borderWidth:1, height:40, width:width/1.4, borderRadius:27, paddingHorizontal:13, paddingVertical:6}}
                        onChangeText={(x)=>{setOMsg(x)}}
                    />
                    <TouchableOpacity style={{width:width/6,backgroundColor:"yellow",borderRadius:20, marginLeft:10, justifyContent:"center",alignItems:"center"}} onPress={sendMessage} >
                            <AntDesign name="arrowright" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }



    function GetS(y) {
        if(y.email == authx.currentUser.email){
            return(
                <View style={{flex:1, marginRight:4, marginLeft:13, marginVertical:5}} >
                     <View style={{alignItems:"flex-end", marginRight:width/27}}>
                         <Text style={{backgroundColor:"lightblue", paddingHorizontal:width/24, paddingVertical:height/55, borderRadius:11, elevation:5}} >{y.text}</Text>
                     </View>
                </View>
            )
        }
        else {
            return(
                <View style={{flex:1, marginVertical:10, marginRight:15}} >
                    <View style={{marginLeft:7, justifyContent:"flex-start", flexDirection:"row",alignItems:"center"}}>
                        <TouchableOpacity onPress={()=>{x.parentNav.navigate("chattersProfile",{avatar:y.avatar,user:y.user, uid: y.uid})}} >
                        <Image source={{uri:y.avatar}} style={{height:20,width:20,borderRadius:50}} />
                        </TouchableOpacity>
                        <View style={{backgroundColor:"yellow", paddingHorizontal:width/24, paddingVertical:height/55, borderRadius:11, marginLeft:5, marginRight:10, elevation:5}} >
                            <Text>{y.text}</Text>
                            <Text style={{fontSize:10,fontStyle:"italic", marginTop:2}} >{y.user}</Text>
                        </View>
                    </View>
                </View>
            )
        }
    }

}


// const date = new  Date
// {date.getUTCHours() + ":" + date.getUTCMinutes() }
//Date.now()