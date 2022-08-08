import React, {useState} from "react";
import { View, Text, Dimensions, TouchableOpacity, Modal, Animated, TextInput, ActivityIndicator, ToastAndroid} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { authx } from "../db/firebase";
import ip from "../constants";
import JWT from 'expo-jwt';

const {width, height} = Dimensions.get("window")



export default function SaySomething(x) {

    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false)
    
    function goBack(){
        x.navigation.pop(1);
    }

    function changeText(x){
        setText(x)
    }

    async function share(){
        if(text.length>0){
            setLoading(true)
            try{
                const token = JWT.encode(authx.currentUser.uid, "secretKey");
                const data = await (await fetch(ip+":8009/postSaySomething", {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        key : token,
                        text:text
                    })
                })).json()
                data;
                setText("")
                setLoading(false)
                ToastAndroid.show(
                    "Raye Posted",
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
            
            <View style={{flex:1, justifyContent:"center", alignItems:"center", top:23}} >
                <View style={{right:width/8, marginBottom:10}}>
                    <Text style={{fontSize:30, fontWeight:"bold", fontStyle:"italic"}} >Whats On</Text>
                    <Text style={{fontSize:30, fontWeight:"bold", fontStyle:"italic"}}>Your Mind?</Text>
                </View>

                <View style={{right:7}}>
                        <TextInput 
                            placeholder="Write Your Thoughts Here"
                            placeholderTextColor="grey"
                            style={{width:width/1.9, minHeight:height/11, maxHeight:height/3 ,color:"black", borderBottomColor:"yellow", borderBottomWidth:1 }}
                            multiline={true}
                            value={text}
                            onChangeText={changeText}
                        />
                        <View style={{alignItems:"flex-end"}} >
                            {
                                (300-text.length) >= 0 ? (
                                <View style={{flexDirection:"row"}} >
                                    <View style={{borderColor:"yellow", borderWidth:3 ,width:width/10, height:height/19, borderRadius:20, top:height/27, justifyContent:"center", alignItems:"center" }}>
                                        <Text style={{fontSize:11, fontWeight:"bold"}}>{300-text.length}</Text>
                                    </View>
                                    <TouchableOpacity style={{width:width/3.9, height:height/17, backgroundColor:"yellow", top:height/27, marginLeft:20, borderRadius:20, justifyContent:"center", alignItems:"center"}} onPress={share} disabled={loading} >
                                       {
                                           (loading == false) ? (
                                                <Text style={{fontWeight:"bold"}} >Share</Text>
                                           ) : (
                                               <ActivityIndicator size="small" color="black" />
                                           )
                                       }
                                        
                                    </TouchableOpacity>
                                </View>
                                ) : (
                                    <View style={{flexDirection:"row"}} >
                                        <View style={{borderColor:"red", borderWidth:3 ,width:width/10, height:height/19, borderRadius:20, top:height/27, justifyContent:"center", alignItems:"center" }}>
                                            <Text style={{fontSize:11, fontWeight:"bold"}}>{300-text.length}</Text>
                                        </View>
                                        <View style={{width:width/3.9, height:height/17, backgroundColor:"lightyellow", top:height/27, marginLeft:20, borderRadius:20, justifyContent:"center", alignItems:"center"}} >
                                            <Text style={{fontWeight:"bold"}} >Share</Text>
                                        </View>
                                    </View>
                                    
                                )
                            }
                            

                        </View>
                </View>
            </View>

        </View>
    )
}


// axios.get(ip+':8009/getTokenTemp')
//                     .then(function (response) {
//                         console.warn(response);
//                         Alert.alert(response.json())
//                     })
//                     .catch(function (error) {
//                         console.warn(error);
//                         Alert.alert(error.json())
//                     })