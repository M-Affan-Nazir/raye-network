import React,{useState, useLayoutEffect, useContext} from "react";
import {View,Text, Dimensions, Image,Modal, ScrollView, TouchableOpacity, Animated} from 'react-native'
import { MainConSocketContext } from "../App";


import { authx } from "../db/firebase";
import JWT from 'expo-jwt'; 
import { useSelector } from "react-redux";

import { FontAwesome } from '@expo/vector-icons';

const {width, height} = Dimensions.get("window")

export default function LetterComp(x){

    const [readModel,setReadModel] = useState(false)
    const [likedByMe,setLikedByMe] = useState(false)
    const [loaded,setLoaded] = useState(false)
    const [read,setRead] = useState(false)

    useLayoutEffect(()=>{
        if(loaded == false){
            if(x.data.likedByMe == "false"){
                setLikedByMe(false)
            }
            else{
                setLikedByMe(true)
            }
            if(x.data.readByMe == "read"){
                setRead(true)
            }
            else{
                setRead(false)
            }
            setLoaded(true)
        }
    })

    const yValue = useState(new Animated.Value(3000))[0]
    const mainConSocket = useContext(MainConSocketContext)
    const navigationRedux = useSelector(state => state.nav)

    return(
        <View style={{flex:1, marginTop:20}}>
            <View style={{minHeight:height/5,width:width/1.2,backgroundColor:"white", borderRadius:11,elevation:5, borderColor:"grey",borderWidth: read == false && x.type == "rec" ? 1 : 0}} >
                <View style={{marginLeft:width/29, marginTop:height/47, flexDirection:"row", bottom:4}}>
                    <TouchableOpacity onPress={()=>{jump(x.data.userData.uid,x.data.userData.userName)}} >
                        <Image 
                            source={{uri:x.data.userData.avatar}}
                            style={{height:height/19, width:width/9.7, borderRadius:900}}
                        />
                    </TouchableOpacity>
                    <View style={{justifyContent:"center", marginBottom:3, marginLeft:10}}>
                        <Text style={{fontSize:15, fontWeight:"bold", color:"grey"}}>{x.data.userData.userName}</Text>
                    </View>
                    <View style={{justifyContent:"center", marginBottom:3, alignItems:"flex-end",flex:1, marginRight:11}}>
                        <Text style={{fontSize:10.5,color:"grey",fontStyle:"italic"}}>{x.data.creationMessage}</Text>
                    </View>
                </View>
                <View style={{flexDirection:"row"}} >
                    <View style={{marginLeft:width/23, marginTop:7}} >
                        <Text style={{color:"grey",fontWeight:"bold",borderBottomColor:"grey",borderBottomWidth:1}} >Subject:</Text>
                    </View>
                    <View style={{marginLeft:10, marginTop:7, maxWidth:width/1.5, marginRight:80, marginBottom:15}} >
                        <Text style={{color:"black",fontWeight:"bold"}}>{x.data.subject}</Text>
                    </View>
                </View>
                {
                    x.type == "rec" && (
                        <View>
                            <View style={{alignItems:"flex-end", marginRight:11, top:21}} >
                                <TouchableOpacity onPress={likeLetter} >
                                <FontAwesome name="heart-o" size={15} color="grey" />
                                {
                                    likedByMe == true && (
                                        <FontAwesome name="heart" size={17} color="red" style={{position:"absolute"}} />
                                    )
                                }
                                </TouchableOpacity>
                            </View>
                            <View style={{marginLeft:10, bottom : 5 ,height:height/27,width:width/9,backgroundColor:"yellow",justifyContent:"center",alignItems:"center",borderRadius:5}} onPress={readModelOpen}  >
                                <TouchableOpacity onPress={readModelOpen} >
                                    <Text style={{fontSize:11, color:"black"}}>Read</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }
                {
                    (x.type == "sent" && x.data.readByMe == "true" && x.data.likedByMe=="false") ? (
                        <View style={{flexDirection:"row"}} >
                            <View style={{marginLeft:10, bottom:9, height:height/27,width:width/9,backgroundColor:"yellow",justifyContent:"center",alignItems:"center",borderRadius:5, marginTop:17}} onPress={readModelOpen}  >
                                <TouchableOpacity onPress={readModelOpen} >
                                    <Text style={{fontSize:11, color:"black"}}>Read</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection:"row",flex:1,justifyContent:"flex-end"}}>
                                <View style={{marginRight:10,marginTop:9}} >
                                    <Text style={{fontSize:11,color:"grey",fontStyle:"italic"}}>Seen</Text>
                                </View>
                            </View>
                        </View>
                    ) : 
                    (x.type == "sent" && x.data.readByMe == "true" && x.data.likedByMe=="true") ? (
                        <View style={{flexDirection:"row"}} >
                            <View style={{marginLeft:10, bottom:9, height:height/27,width:width/9,backgroundColor:"yellow",justifyContent:"center",alignItems:"center",borderRadius:5, marginTop:17}} onPress={readModelOpen}  >
                                <TouchableOpacity onPress={readModelOpen} >
                                    <Text style={{fontSize:11, color:"black"}}>Read</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection:"row",flex:1,justifyContent:"flex-end"}} >
                                <View style={{marginRight:10,marginTop:11}} >
                                    <Text style={{fontSize:11,color:"grey",fontStyle:"italic"}}>Seen And <Text style={{fontSize:11,color:"red",fontStyle:"italic"}} >Liked</Text> </Text>
                                </View>
                            </View>
                    </View>
                    ) :
                    (x.type == "sent" && x.data.readByMe == "read" && x.data.likedByMe=="false") ? (
                        <View style={{flexDirection:"row"}} >
                            <View style={{marginLeft:10, bottom:9, height:height/27,width:width/9,backgroundColor:"yellow",justifyContent:"center",alignItems:"center",borderRadius:5, marginTop:17}} onPress={readModelOpen}  >
                                <TouchableOpacity onPress={readModelOpen} >
                                    <Text style={{fontSize:11, color:"black"}}>Read</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection:"row",flex:1,justifyContent:"flex-end"}}>
                                <View style={{marginRight:10,marginTop:9}} >
                                    <Text style={{fontSize:11,color:"grey",fontStyle:"italic"}}>Read</Text>
                                </View>
                            </View>
                        </View>
                    ) : 
                    (x.type == "sent" && x.data.readByMe == "read" && x.data.likedByMe=="true") ? (
                        <View style={{flexDirection:"row"}} >
                            <View style={{marginLeft:10, bottom:9, height:height/27,width:width/9,backgroundColor:"yellow",justifyContent:"center",alignItems:"center",borderRadius:5, marginTop:17}} onPress={readModelOpen}  >
                                <TouchableOpacity onPress={readModelOpen} >
                                    <Text style={{fontSize:11, color:"black"}}>Read</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection:"row",flex:1,justifyContent:"flex-end"}} >
                                <View style={{marginRight:10,marginTop:11}} >
                                    <Text style={{fontSize:11,color:"grey",fontStyle:"italic"}}>Read And <Text style={{fontSize:11,color:"red",fontStyle:"italic"}} >Liked</Text> </Text>
                                </View>
                            </View>
                    </View>
                    ) : 
                    (x.type == "sent" && x.data.readByMe == "false" && x.data.likedByMe=="false") && (
                        <View style={{marginLeft:10, bottom:9, height:height/27,width:width/9,backgroundColor:"yellow",justifyContent:"center",alignItems:"center",borderRadius:5, marginTop:17}} onPress={readModelOpen}  >
                                <TouchableOpacity onPress={readModelOpen} >
                                    <Text style={{fontSize:11, color:"black"}}>Read</Text>
                                </TouchableOpacity>
                        </View>
                    )
                }
            </View>


            <Modal visible={readModel} transparent>
                <View style={{flex:1, backgroundColor:"rgba(9,9,0,0.85)", alignItems:"center", justifyContent:"center"}}>
                    <Animated.View style={{transform:[{translateY:yValue}]}} >
                        <View style={{width:width/1.15, height:height/3.5, maxHeight:height/1.3, backgroundColor:"white", borderRadius:3}}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{marginLeft:width/23, marginTop:height/49, flexDirection:"row"}} >
                                {
                                    x.type == "rec" ? (
                                        <Text style={{color:"grey",fontStyle:"italic",fontSize:12.3}} >From,</Text>
                                    ) : (
                                        <Text style={{color:"grey",fontStyle:"italic",fontSize:12.3}} >To,</Text>
                                    )
                                }
                                <View style={{alignItems:"flex-end",flex:1, marginRight:10}} >
                                    <TouchableOpacity onPress={readModelClose}>
                                        <Text style={{fontSize:12.3}}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{marginLeft:width/29, marginTop:height/50, flexDirection:"row", bottom:4}}>
                                <Image 
                                    source={{uri:x.data.userData.avatar}}
                                    style={{height:height/19, width:width/9.7, borderRadius:900}}
                                />
                                <View style={{justifyContent:"center", marginBottom:3, marginLeft:10}}>
                                    <Text style={{fontSize:15, fontWeight:"bold", color:"grey"}}>{x.data.userData.userName}</Text>
                                    <Text style={{fontSize:12, fontWeight:"bold", color:"grey",fontStyle:"italic"}}>@ {x.data.userData.userInsignia}</Text>
                                    <Text style={{fontSize:11,color:"grey",fontStyle:"italic"}}>{new Date(x.data.createdAt*1000).toDateString()}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:"row"}} >
                                <View style={{marginLeft:width/23, marginTop:7}} >
                                    <Text style={{color:"grey",fontWeight:"bold",borderBottomColor:"grey",borderBottomWidth:1, fontSize:12}} >Subject:</Text>
                                </View>
                                <View style={{marginLeft:10, marginTop:7, maxWidth:width/1.5, marginRight:80, marginBottom:15}} >
                                    <Text style={{color:"black",fontWeight:"bold"}}>{x.data.subject}</Text>
                                </View>
                            </View>
                            <View style={{marginLeft:width/22, marginTop:7, marginRight:5, paddingBottom:21}} > 
                                <Text style={{color:"grey",fontWeight:"bold"}}>" {x.data.text} "</Text>
                            </View>
                        </ScrollView>
                        </View>
                    </Animated.View>
                </View>
            </Modal>

        </View>
    )

    function readModelOpen(){
        setRead(true)
        if(x.data.readByMe != "read" && x.type == "rec" ){
            const token = JWT.encode(authx.currentUser.uid, "secretKey");
            mainConSocket.emit("readLetter",token,x.data._id)
        }
        setReadModel(true)
        Animated.timing(yValue, {
            toValue:0,
            duration:300,
            useNativeDriver:true
        }).start()
    }
    function readModelClose(){
        Animated.timing(yValue, {
            toValue:3000,
            duration:1,
            useNativeDriver:true
        }).start(() => setReadModel(false))
    }

    function likeLetter(){
        const token = JWT.encode(authx.currentUser.uid, "secretKey");
        if(likedByMe == false){
            mainConSocket.emit("likeUnlikeLetter",token,x.data._id,"like")
        }
        else{
            mainConSocket.emit("likeUnlikeLetter",token,x.data._id,"unlike")
        }
        setLikedByMe(x => !x)
    }

    function jump(uid,name) {
        if(uid != authx.currentUser.uid){
            navigationRedux.navigate("chattersProfile",{user:name, uid:uid})
        }
    }
}