import { useContext, useLayoutEffect, useState } from "react";
import { View, Text, Dimensions, TouchableOpacity, Modal, Animated, TextInput, Image, ActivityIndicator, FlatList, TouchableWithoutFeedback} from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';  
import { authx } from "../db/firebase";
import JWT from 'expo-jwt';
import ip from "../constants";
import { useSelector } from "react-redux";

const {width, height} = Dimensions.get("window")

export default function SharePostUnavailable(x){


    const [optionsModel,setOptionsModel] = useState(false)
    const [deletePost, setDeletePost] = useState(null)
    const [disableButtonPress, setdisableButtonPress] = useState(false)
    const [deletionState,setDeletionState] = useState("deleted")

    const navigationContext = useSelector(state => state.nav)


    return (
        <View style={{justifyContent:"center",alignItems:"center", marginTop:20}}>

            {
                (deletionState == "loading") && (
                    <View style={{position:"absolute",justifyContent:"center",alignItems:"center"}} >
                        <ActivityIndicator size="large" color="black" />
                    </View>
                )   
            }
            {
                (deletionState == "deleted") && (
                    <View style={{position:"absolute",justifyContent:"center",alignItems:"center"}} >
                        <Text style={{color:"red",fontSize:15}}>Deleted Post</Text>
                    </View>
                )
            }
            {
                (deletionState == "error") && (
                    <View style={{position:"absolute",justifyContent:"center",alignItems:"center"}} >
                        <Text style={{color:"red",fontSize:15}}>Oops! An Error Occured</Text>
                    </View>
                )
            }

            <View style={{opacity : (optionsModel == false && deletePost == x.data.postID && deletePost != null) ? 0.45 : 1}} >

                            <View  style={{height:height/11.3, width:width/1.23, backgroundColor:"#eff7b0", borderTopLeftRadius:26, borderTopRightRadius:26, top:20}}>
                                <View style={{marginLeft:width/27, marginTop:height/59, flexDirection:"row", bottom:4}} >
                                        <TouchableOpacity disabled={disableButtonPress} onPress={()=> jump(x.data.userData.uid, x.data.userData.userName)}>
                                            <Image 
                                                source={{uri:x.data.userData.avatar}}
                                                style={{height:height/25, width:width/13, borderRadius:900}}
                                            />
                                        </TouchableOpacity>
                                        <View style={{justifyContent:"center", marginLeft:5}} >
                                            <Text style={{fontWeight:"bold", fontSize:13, color:"grey"}}>{x.data.userData.userName}<Text style={{fontWeight:"normal", fontStyle:"italic"}}> shared</Text></Text>
                                        </View>
                                        {
                                            ( x.data.userData.uid == authx.currentUser.uid ) && (
                                                <TouchableOpacity style={{justifyContent:"center",alignItems:"flex-end", marginRight:15, flex:1}} onPress={()=>{setOptionsModel(true), setDeletePost(x.data.postID)}} disabled={disableButtonPress} >
                                                    <Entypo name="dots-three-vertical" size={13} color="grey" />
                                                </TouchableOpacity>
                                            )
                                        }
                                    </View>
                            </View>
                

                <View style={{minHeight:height/7.5, width:width/1.23, backgroundColor:"white", borderRadius:26, elevation:3, borderLeftColor:"grey",borderLeftWidth:0.3, borderRightColor:"grey",borderRightWidth:0.3}}>
                    <View style={{marginLeft:width/27, marginTop:height/59, flexDirection:"row"}} >
                        <TouchableOpacity disabled={disableButtonPress} onPress={()=>{jump(x.data.postType == "share" ? x.data.postUserData.uid : x.data.userData.uid, x.data.postType == "share" ? x.data.postUserData.userName : x.data.userData.userName)}}>    
                            <Image 
                                source={{uri: x.data.postType == "share" ? x.data.postUserData.avatar : x.data.userData.avatar }}
                                style={{height:height/23, width:width/11.7, borderRadius:900}}
                            />
                        </TouchableOpacity>
                        <View style={{justifyContent:"center", marginLeft:5}} >
                            <Text style={{fontWeight:"bold", fontSize:13.3, color:"grey"}}>{x.data.postType == "share" ? x.data.postUserData.userName : x.data.userData.userName }</Text>
                        </View>
                    </View>
                    <View style={{justifyContent:"center", alignItems:"center", flex:1, right: width/27, flexDirection:"row"}} >
                        <FontAwesome name="ban" size={24} color="lightgrey" />
                        <Text style={{color:"lightgrey", marginLeft:17, fontStyle:"italic"}}>Post Deleted By User</Text>
                    </View>
                </View>

                <Modal visible={optionsModel} transparent>
                    <View style={{backgroundColor:"rgba(9,9,0,0.08)", flex:1, alignItems:"center", justifyContent:"center", height:100}}>
                            <View style={{height:height/5,width:width/1.7, backgroundColor:"white", borderRadius:20}} >
                                <TouchableOpacity style={{alignItems:"center", marginTop:30, borderColor:"lightgrey", borderBottomWidth:0.3, borderTopWidth:0.3, padding:11}} onPress={deletePostFunc}>
                                    <Text style={{color:"red"}}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{alignItems:"center", marginTop:0, borderColor:"lightgrey", borderBottomWidth:0.7, padding:11}} onPress={()=>{setOptionsModel(false), setDeletePost(null)}}>
                                    <Text style={{color:"grey"}}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                    </View>
                </Modal>

            </View>
        </View>
    )

    async function deletePostFunc(){
        setdisableButtonPress(true)
        setOptionsModel(false)
        setDeletionState("loading")
        try{
            const token = await JWT.encode(authx.currentUser.uid, "secretKey");
            const data = await (await fetch(ip+":8009/deletePost", { 
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    key : token,
                    postID : deletePost
                })
            })).json()
            data;
            if(data == "success"){
                setDeletionState("deleted")
            }
            else{
                setDeletionState("error")
            }
        }
        catch(e){
            console.warn(e)
        }
    }

    function jump(uid,name) {   //same user ki UID and UserName
        if(uid != authx.currentUser.uid){
            navigationContext.navigate("chattersProfile",{user:name, uid:uid})
        }
    }

}