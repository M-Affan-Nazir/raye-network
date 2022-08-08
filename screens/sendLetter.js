import React,{useState} from "react";
import {View,Text, TouchableOpacity, Dimensions, Image, TextInput, ScrollView, ActivityIndicator, ToastAndroid} from 'react-native'

import { Ionicons } from '@expo/vector-icons';
import JWT from 'expo-jwt';
import { authx } from "../db/firebase";
import ip from "../constants"

const {width, height} = Dimensions.get("window")

export default function SendLetter(x){

    const [subject,setSubject] = useState("")
    const [text,setText] = useState("")
    const [buttonState,setButtonState] = useState("none")

    // console.warn(x.route.params.userInsignia)
    return(
        <ScrollView style={{flex:1, backgroundColor:"white"}}>
            <TouchableOpacity style={{position:"absolute", marginTop:height/7, marginLeft:width/19}} onPress={goBack}  >
                <Ionicons name="arrow-back-sharp" size={24} color="black" />
            </TouchableOpacity>
            <View style={{marginTop:height/2.9, marginLeft:width/5}} >
                <View style={{marginBottom:13,}} >
                    <Text style={{color:"grey",fontStyle:"italic",fontSize:13}} >To,</Text>
                </View>
                <View style={{flexDirection:"row"}} >
                <Image 
                    source={{uri:x.route.params.avatar}}
                    style={{height:height/19, width:width/9.7, borderRadius:900}}
                />
                <View style={{justifyContent:"center", marginBottom:3, marginLeft:10}}>
                                    <Text style={{fontSize:15, fontWeight:"bold", color:"grey"}}>{x.route.params.userName}</Text>
                                    <Text style={{fontSize:12, fontWeight:"bold", color:"grey",fontStyle:"italic"}}>@ {x.route.params.userInsignia}</Text>
                </View>
                </View>
                <View style={{marginTop:20, flexDirection:"row"}} >
                    <TextInput 
                            placeholder="Subject"
                            style={{width:width/1.7,height:height/19, backgroundColor:"white", borderBottomColor:"grey",borderBottomWidth:1}}
                            editable={buttonState == "none" ? true : false}
                            autoFocus
                            value={subject}
                            onChangeText={changeSubject}
                    />
                    {
                                (30-subject.length) >= 0 ? (
                                    <View style={{borderColor:"yellow", borderWidth:2.5 ,width:width/14.1, height:height/25, borderRadius:20, top:5, justifyContent:"center", alignItems:"center", left:17 }}>
                                        <Text style={{fontSize:11, fontWeight:"bold"}}>{30-subject.length}</Text>
                                    </View>
                                ) : (
                                    <View style={{borderColor:"red", borderWidth:2.5 ,width:width/14.1, height:height/25, borderRadius:20, top:5, justifyContent:"center", alignItems:"center", left:17}}>
                                            <Text style={{fontSize:11, fontWeight:"bold"}}>{30-subject.length}</Text>
                                    </View>
                                )
                    }
                </View>
                <View style={{marginTop:20}} >
                    <TextInput 
                            placeholder="Letter"
                            style={{width:width/1.7,maxHeight:height/6 ,backgroundColor:"white", borderBottomColor:"grey",borderBottomWidth:1}}
                            multiline={true}
                            editable={buttonState == "none" ? true : false}
                            value={text}
                            onChangeText={changeText}
                        />
                </View>
                <TouchableOpacity style={{height:height/19,width:width/7,backgroundColor:"yellow", marginLeft:width/2.21, marginTop:41,borderRadius:10, justifyContent:"center",alignItems:"center"}} onPress={SendLetter} disabled={buttonState == "none" ? false : true} >
                    {
                        buttonState == "none" ? (
                            <Text style={{fontWeight:"bold",fontSize:11.7}} >Send</Text>
                        ) : 
                        (
                            <ActivityIndicator size="small" color="black" />
                        )
                    }
                </TouchableOpacity>
            </View>
        </ScrollView>
    )

    function goBack(){
        x.navigation.pop(1);
    }

    function changeSubject(x){
        setSubject(x)
    }

    function changeText(x){
        setText(x)
    }

    async function SendLetter(){
        if(subject.length<31 && subject.length > 0 && text.length > 0){
            try{
                setButtonState("loading")
                const token = JWT.encode(authx.currentUser.uid, "secretKey");
                const data = await (await fetch(ip+":8012/postLetter", {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        key : token,
                        toUID : x.route.params.uid,
                        subject : subject,
                        text : text
                    })
                })).json()
                data;
                setButtonState("none")
                ToastAndroid.show(
                    "Letter Dispatched",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                )
                goBack()
            }
            catch(e){
                console.warn(e)
                setButtonState("none")
                goBack()
            }
        }
    }

}