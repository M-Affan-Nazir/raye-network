import React, {useState, useLayoutEffect} from "react";
import { View, Text, Dimensions, TouchableOpacity, Modal, Animated, ActivityIndicator, FlatList} from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SaySomethingComp from "./saySomethingComponent";
import AnnouncementComp from "./announcementComponent";
import SharePostUnavailable from "./sharepostUnavailable";
import { authx } from "../db/firebase";
import ip from "../constants";
import JWT from 'expo-jwt';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addUsersPosts } from "../redux/actions/usersPosts";

const {width, height} = Dimensions.get("window")

export default function ProfilePage(x) {

    const [visible, setVisible] = useState(false)
    const viewPos = useState(new Animated.Value(600))[0]
    const [loaded, setLoaded] = useState(false)
    // const [posts, setPosts] = useState([])

    const dispatch = useDispatch()

    useLayoutEffect(()=>{
        if(!loaded){
            getPosts()
        }
    })

    let reduxPosts = useSelector(state => state.usersPosts)
    
    async function getPosts(){
        try{
            const token = JWT.encode(authx.currentUser.uid, "secretKey");
            const data = await (await fetch(ip+":8010/getUserPosts", { 
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    key : token,
                    uid : authx.currentUser.uid
                })
            })).json()
            data;
            dispatch(addUsersPosts(data))
            // setPosts(data)
            setLoaded(true)
        }
        catch(e){
            console.warn(e)
        }
    }

    function openAddPost(){
        setVisible(true)
        Animated.timing(viewPos, {
            toValue:0,
            duration:273,
            useNativeDriver:true
        }).start()
    }

    function closeAddPost (){
        Animated.timing(viewPos, {
            toValue:600,
            duration:200,
            useNativeDriver:true
        }).start(()=>{setVisible(false)})
    }

    function goToSaySomething() {
        x.navigation.navigate("saySomething")
        Animated.timing(viewPos, {
            toValue:600,
            duration:10,
            useNativeDriver:true
        }).start(()=>{setVisible(false)})
    }

    function goToAnnounce(){
        x.navigation.navigate("announce")
        Animated.timing(viewPos, {
            toValue:600,
            duration:10,
            useNativeDriver:true
        }).start(()=>{setVisible(false)})
    }

    if(!reduxPosts || !loaded){
        return(
            <View style={{backgroundColor:"white", alignItems:"center", justifyContent:"center", marginTop:height/7}}>
                <ActivityIndicator size="large" color="black" />
            </View>
        )
    }
    else {
        return(
            
            <View style={{alignItems:"center", marginTop:10, flex:1}} >
                <TouchableOpacity style={{backgroundColor:"yellow", width:"71%", height:height/16, borderRadius:9, justifyContent:"center", alignItems:"center"}} onPress={openAddPost} >
                    <FontAwesome5 name="pen" size={19} color="black" />
                </TouchableOpacity>
                
                {
                    reduxPosts.length == 0 && (
                        <View style={{marginTop:height/6,alignItems:"center"}} >
                            <MaterialCommunityIcons name="feather" size={31} color="grey" />
                            <Text style={{color:"grey",fontSize:11,fontStyle:"italic"}}>What's Your Raye?</Text>
                        </View>
                    )
                }

                <FlatList 
                        showsVerticalScrollIndicator={false}
                        data={reduxPosts}
                        renderItem={({item}) => {
                            if(item.postType == "saySomething"){
                                return(
                                    <SaySomethingComp data={item} />
                                )
                            }
                            else if(item.postType == "announcement"){
                                return(
                                    <AnnouncementComp data={item}  />
                                )
                            }
                            else if(item.postType == "share" && item.code == "available"){
                                if(item.sharedPostData.postType == "saySomething"){
                                    return(
                                        <SaySomethingComp data={item} />
                                    )
                                }
                                else if(item.sharedPostData.postType == "announcement" && item.code == "available"){
                                    return(
                                        <AnnouncementComp data={item}  />
                                    )
                                }
                            }
                            else if(item.postType == "share" && item.code == "unavailable"){
                                return(
                                    <SharePostUnavailable data={item} />
                                )
                            }
                        }
                                                
                        }
                        keyExtractor={(item, index) => { return(index.toString())}} 
                        ListFooterComponentStyle={{flex:1, justifyContent: 'flex-end'}}
                        ListFooterComponent={<View style={{height:150}} 
                                            />}
                />   
    
    
                <Modal transparent visible={visible} animationType="fade" onRequestClose={closeAddPost} >
                    <View style={{flex:1, backgroundColor:"rgba(0,0,0,0.77)", justifyContent:"flex-end"}}>
                        <Animated.View style={{backgroundColor:"white", width:"100%", height:height/4, borderTopLeftRadius:15, borderTopRightRadius:15, transform:[{translateY:viewPos}]}} >
                            <View style={{flexDirection:"row-reverse", marginTop:13, marginLeft:9}}>
                                <TouchableOpacity onPress={closeAddPost} >
                                    <Entypo name="cross" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                            <View style={{marginLeft:20}} >
                                <TouchableOpacity style={{flexDirection:"row", alignItems:"center"}} onPress={goToSaySomething} >
                                    <View style={{backgroundColor:"yellow", width:width/7.5, height:height/15, borderRadius:80, justifyContent:"center", alignItems:"center"}}>
                                        <Entypo name="text" size={21} color="black" />
                                    </View>
                                    <View style={{marginLeft:15}} >
                                        <Text style={{fontSize:17, fontWeight:"bold"}}>Say Something</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{flexDirection:"row", alignItems:"center", marginTop:17}} onPress={goToAnnounce} >
                                    <View style={{backgroundColor:"yellow", width:width/7.5, height:height/15, borderRadius:80, justifyContent:"center", alignItems:"center"}}>
                                        <Ionicons name="megaphone-outline" size={24} color="black" />
                                    </View>
                                    <View style={{marginLeft:15}} >
                                        <Text style={{fontSize:17, fontWeight:"bold"}}>Announce</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </View>
                </Modal>
    
    
            </View>
        )
    }
}