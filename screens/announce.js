import React, {useState} from "react";
import { View, Text, Dimensions, TouchableOpacity, Modal, Animated, TextInput, ActivityIndicator, ToastAndroid} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { authx } from "../db/firebase";
import ip from "../constants";
import JWT from 'expo-jwt';

const {width, height} = Dimensions.get("window")


export default function Announce(x) {

    const [title, setTitle] = useState("");
    const [announcement, setAnnouncement] = useState("");
    const [loading, setLoading] = useState(false)

    function goBack(){
        x.navigation.pop(1);
    }

    function changeTitle(x){
        setTitle(x)
    }

    function changeAnnouncement(x){
        setAnnouncement(x)
    }

    async function announce(){
        if(title.length > 0 && announcement.length > 0){
            setLoading(true)
            try{
                const token = JWT.encode(authx.currentUser.uid, "secretKey");
                const data = await (await fetch(ip+":8009/postAnnouncement", {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        key : token,
                        title:title,
                        announcement:announcement
                    })
                })).json()
                data;
                setTitle("")
                setAnnouncement("")
                setLoading(false)
                ToastAndroid.show(
                    "Announced",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                )
                x.navigation.pop(1);
            }
            catch(e){
                console.warn(e)
                setLoading(false)
            }
        }
    }

    return(
        <View style={{ flex:1, backgroundColor:"white"}}>
            <TouchableOpacity style={{position:"absolute", marginTop:height/8, marginLeft:width/19}} onPress={goBack}  >
                <Ionicons name="arrow-back-sharp" size={24} color="black" />
            </TouchableOpacity>
            
            <View style={{flex:1, justifyContent:"center", alignItems:"center", top:33, left:3}} >
                <View style={{marginBottom:10}}>
                    <Text style={{fontSize:30, fontWeight:"bold", fontStyle:"italic"}} >Whats Your</Text>
                    <Text style={{fontSize:30, fontWeight:"bold", fontStyle:"italic"}}>Announcement About?</Text>
                </View>

                <View style={{right:15}}>
                        <View style={{flexDirection:"row"}} >
                            <TextInput 
                                placeholder="Title"
                                placeholderTextColor="grey"
                                style={{width:width/2.9,color:"black", borderBottomColor:"yellow", borderBottomWidth:1, marginTop:15, right:15 }}
                                value={title}
                                onChangeText={changeTitle}
                            />
                            {
                                (10-title.length) >= 0 ? (
                                    <View style={{borderColor:"yellow", borderWidth:2.5 ,width:width/14.1, height:height/25, borderRadius:20, top:height/38, justifyContent:"center", alignItems:"center" }}>
                                        <Text style={{fontSize:11, fontWeight:"bold"}}>{10-title.length}</Text>
                                    </View>
                                ) : (
                                    <View style={{borderColor:"red", borderWidth:2.5 ,width:width/14.1, height:height/25, borderRadius:20, top:height/38, justifyContent:"center", alignItems:"center"}}>
                                            <Text style={{fontSize:11, fontWeight:"bold"}}>{10-title.length}</Text>
                                    </View>
                                )
                            }
                        </View>
                        <View style={{flexDirection:"row"}} >
                            <TextInput 
                                placeholder="Announcement"
                                placeholderTextColor="grey"
                                style={{width:width/1.9, maxHeight:height/6 ,color:"black", borderBottomColor:"yellow", borderBottomWidth:1, right:15, marginTop:20 }}
                                multiline={true}
                                value={announcement}
                                onChangeText={changeAnnouncement}
                                 maxLength={149}
                            />
                            {
                                (50-announcement.length) >= 0 ? (
                                    <View style={{borderColor:"yellow", borderWidth:2.5 ,width:width/14.1, height:height/25, borderRadius:20, top:height/38, justifyContent:"center", alignItems:"center"}}>
                                        <Text style={{fontSize:11, fontWeight:"bold"}}>{50-announcement.length}</Text>
                                    </View>
                                ) : (
                                    <View style={{borderColor:"red", borderWidth:2.5 ,width:width/14.1, height:height/25, borderRadius:20, top:height/38, justifyContent:"center", alignItems:"center"}}>
                                            <Text style={{fontSize:11, fontWeight:"bold"}}>{50-announcement.length}</Text>
                                    </View>
                                )
                            }
                        </View>
                        <View style={{marginTop:height/15, alignItems:"flex-end", left:width/7}} >
                            {
                                (10-title.length) >= 0 && (50-announcement.length) >= 0 ? (
                                    <TouchableOpacity style={{height:height/16.5, width:width/5, backgroundColor:"yellow", borderRadius:29, borderColor:"black", borderWidth:0.2, justifyContent:"center", alignItems:"center", elevation:2}} onPress={announce} disabled={loading} >
                                       {
                                           (loading == false) ? (
                                               <Ionicons name="megaphone-outline" size={21} color="black" />
                                           ) : (
                                               <ActivityIndicator size="small" color="black" />
                                           )
                                       }
                                    </TouchableOpacity>
                                ) : (
                                    <View style={{height:height/16.5, width:width/5, backgroundColor:"lightyellow", borderRadius:29, borderColor:"black", borderWidth:0.2, justifyContent:"center", alignItems:"center", elevation:2}}>
                                        <Ionicons name="megaphone-outline" size={21} color="black" />
                                    </View>
                                )
                            }
                            
                        </View>
            
                </View>
            </View>

        </View>
    )
}