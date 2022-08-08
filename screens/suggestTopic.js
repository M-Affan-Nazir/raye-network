import React,{useState} from 'react'
import {View, StyleSheet, Dimensions, TextInput, TouchableOpacity, Alert, ActivityIndicator} from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { collection, addDoc } from 'firebase/firestore';
import { dbx } from '../db/firebase';

const {width, height} = Dimensions.get("window")

export default function SuggestTopic(x) {

    const [topic, setTopic] = useState()
    const [description, setDescription] = useState()
    const [sending, setSending] = useState(false)

    async function finalSend(){
        if(topic && description){
            try{
                setSending(true)
                await addDoc(collection(dbx,"topic_suggestion"), {
                    topic:topic,
                    description:description,
                    userName:x.route.params.userName,
                    uid:x.route.params.uid
                })
                x.navigation.pop()
                Alert.alert("Suggestion Noted","(:")
            }catch(e){
                x.navigation.pop()
                Alert.alert("Oops!","Looks like something went wrong. Try Again Soon.")
            }
        }

    }

    if(sending){
        return(
            <View style={{flex:1, backgroundColor:"white", alignItems:"center", justifyContent:"center"}}>
                <ActivityIndicator size="large" color="black" />
            </View>
        )
    }

    return(
        <View style={styles.container} >
                <FontAwesome name="newspaper-o" size={width/3.5} color="black" />
                    <TextInput 
                        placeholder={"TOPIC NAME"}
                        value={topic}
                        onChangeText={(x)=>{setTopic(x)}}
                        maxLength={23}
                        style={{borderColor:"lightGrey", borderWidth:0.9, height:height/17, width:width/1.5, borderRadius:20, paddingHorizontal:25, marginTop:height/25, color:"grey"}}
                    />
                    <TextInput 
                        placeholder={"SHORT DESCRIPTION"}
                        value={description}
                        onChangeText={(x)=>{setDescription(x)}}
                        maxLength={50}
                        style={{borderColor:"lightGrey", borderWidth:0.9, height:height/17, width:width/1.5, borderRadius:20, paddingHorizontal:25, marginTop:height/25, color:"grey"}}
                    />
            <TouchableOpacity style={{height:height/12, width:width/4, backgroundColor:"lightblue",borderRadius:15, marginTop:20, justifyContent:"center", alignItems:"center"}} onPress={finalSend} >
                    <FontAwesome name="arrow-right" size={33} color="grey" />
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({
    container : {
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    }
})