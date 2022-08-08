import React, {useLayoutEffect, useState} from "react";
import { View, Text, StyleSheet, Image, Dimensions, TextInput, TouchableOpacity, Modal, ActivityIndicator, ScrollView, Animated, RefreshControl} from "react-native";
import { getAuth } from "firebase/auth";
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import {signOut} from "firebase/auth"
import {authx} from "../db/firebase"
import ip from "../constants"
import ProfilePage from "../components/profilePage";
import JWT from 'expo-jwt';
import { useDispatch } from "react-redux";
import { addUsersPosts } from "../redux/actions/usersPosts";

const {width, height} = Dimensions.get("window")


export default function Profile(x) {

    const [visible, setVisible] = useState(false)
    const [user, setUser] = useState("")
    const [loaded, setLoaded] = useState(false)
    const [userData,setUserData] = useState()
    const [visible2, setVisible2] = useState(false)
    const[newStandpoint, setNewStandpoint] = useState()
    const [loading2, setLoading2] = useState(false)
    const viewPos = useState(new Animated.Value(600))[0]
    const[ref,setRef] = useState(false)

    const dispatch = useDispatch()
    

    useLayoutEffect(()=>{
        if(!user){
            const auth = getAuth()
            setUser(auth.currentUser)
        }
        if(!loaded){
            getData()
        }
    })

    async function getData() {
            try{
                const data = await (await fetch(ip+":8006/getUserData", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uid: authx.currentUser.uid,
                    uidUser : authx.currentUser.uid
                })
            })).json()
            data
            setUserData(data)
            setLoaded(true)
            x.navigation.setOptions({title: "@ " + data.userInsignia})
            } catch (e) {
                console.warn(e)
            }
    }
    

    function showModel() {
        setVisible(true)
    }
    function hideModel() {
        setVisible(false)
    }
    function topic() {
        hideModel()
        x.navigation.navigate("suggestTopic",{userName:user.displayName, uid:user.uid})
    }

    function jump(y){
        if(y == 1){
            x.navigation.navigate("supportList",{code:1, user:user.displayName, uid:user.uid})
        } else {
            x.navigation.navigate("supportList",{code:2, user:user.displayName, uid:user.uid})
        }
    }

    function hideModel2() {
        Animated.timing(viewPos, {
            toValue:600,
            duration:153,
            useNativeDriver:true
        }).start(()=>{setVisible2(false)})
    }

    function penPress() {
        setNewStandpoint(userData.standPoint)
        setVisible2(true)
        Animated.timing(viewPos, {
            toValue:0,
            duration:273,
            useNativeDriver:true
        }).start()
    }

    function newStandInputHandler(x){
        setNewStandpoint(x)
    }

    async function tick(){
        if(newStandpoint != userData.standPoint){
            try{
                setLoading2(true)
                const data = await (await fetch(ip+":8005/updateStandpoint", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uid: user.uid,
                    standPoint: newStandpoint
                })
            })).json()
            data
            userData.standPoint = newStandpoint
            setLoading2(false)
            setVisible2(false)
            } catch(e){
                console.warn(e)
                setLoading2(false)
                setVisible2(false)
            }
        }
    }

    if(!userData) {
        return (
            <View style={{flex:1, backgroundColor:"white", alignItems:"center", justifyContent:"center"}}>
                <ActivityIndicator size="large" color="black" />
            </View>
        )
    }
    else {
        return(
            <ScrollView 
                style={styles.container} 
                refreshControl={
                    <RefreshControl 
                        refreshing={ref}
                        onRefresh={refreshPage}
                    />
                }
            >
                <View style={{flexDirection:"row"}} >
                    <View style={{height:height/7.5, width:width/4, backgroundColor:"#98A206", borderRadius:1000, marginTop: 30, marginLeft:17, position:"absolute" }} />
                    <Image source={{uri:userData.avatar}} 
                        style={{height: height/7.5, width:width/4, borderRadius:1000, marginTop: 30, marginLeft:17}}
                    />
                    <View style={{position:"absolute", backgroundColor:"white",  marginTop: height/6.9, marginLeft: (width/4)+1, height:24, width:24, borderRadius:100 }}/>
                    <TouchableOpacity style={{position:"absolute" ,height:40,width:40, marginTop: height/7.5, marginLeft: (width/4)-7  ,justifyContent:"center",alignItems:"center"}} onPress={()=>{x.navigation.navigate("uploadImage",{uid:user.uid})}} >
                       <AntDesign name="pluscircle" size={21} color="black" />
                    </TouchableOpacity>
                    <View style={{marginTop: 47, marginLeft:width/20, height:height/10, width:width/6, alignItems:"center"}}>
                        <Text style={{fontSize:23, fontWeight:"bold"}}>{userData.totalPosts}</Text>
                        <Text style={{fontSize:13}}>Posts</Text>
                    </View>
                    <TouchableOpacity style={{marginTop: 47, marginLeft:15, height:height/12, width:width/6, alignItems:"center"}} onPress={()=>{jump(1)}} >
                        <Text style={{fontSize:23, fontWeight:"bold"}}>{userData.supportersNumber}</Text>
                        <Text style={{fontSize:13}}>Supporters</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginTop: 47, marginLeft:17, height:height/12, width:width/6, alignItems:"center"}} onPress={()=>{jump(2)}} >
                        <Text style={{fontSize:23, fontWeight:"bold"}}>{userData.supportingNumber}</Text>
                        <Text style={{fontSize:13}}>Supporting</Text>
                    </TouchableOpacity>
                </View>
                    <View style={{flexDirection:"row"}}>
                        <View style={{marginTop: 11, marginLeft:width/15}}>
                            <Text style={{fontSize:21, fontWeight:"bold", color:"grey"}} >{userData.userName}</Text>
                        </View>
                    </View>
                <TouchableOpacity style={{position:"absolute", marginLeft:width-27}} onPress={showModel} >
                    <Entypo name="dots-three-vertical" size={17} color="black" />
                </TouchableOpacity>
                <View style={{flexDirection:"row", marginHorizontal:width/19}}>
                    <View style={{marginTop:height/37}} >
                         <Text style={{fontWeight:"bold", fontStyle:"italic", fontSize:14.5}}>" {userData.standPoint} "</Text>
                    </View>
                    <TouchableOpacity style={{marginTop:height/37, marginHorizontal:13}} onPress={penPress} >
                        <FontAwesome5 name="edit" size={19} color="grey" />
                    </TouchableOpacity>
                </View>

                <View style={{alignItems:"center", marginTop:height/23, marginHorizontal:width/8}}>
                    <View style={{backgroundColor:"lightgrey", height:1, width:"100%"}}></View>
                </View>
                
                <ProfilePage navigation={x.navigation} />
                
                            
                <Modal transparent visible={visible} animationType="fade" >
                    <View style={{flex:1, backgroundColor:"rgba(0,0,0,0.5)", justifyContent:"center", alignItems:"center"}}>
                        <View style={{backgroundColor:"white", height:height/3, width:width/1.7, borderRadius:13}}>
                            <View style={{flexDirection:"row-reverse", marginTop:13, marginLeft:9}}>
                                <TouchableOpacity onPress={hideModel} >
                                    <Entypo name="cross" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                            <View style={{justifyContent:"center", marginTop:height/21, flexDirection:"row"}}>
                                <TouchableOpacity style={{height:height/14, width:width/2.3,borderColor:"grey", elevation:1, borderRadius:3, justifyContent:"center", alignItems:"center", flexDirection:"row"}} onPress={topic} >
                                    <FontAwesome5 name="newspaper" size={23} color="grey" />
                                    <View style={{marginHorizontal:7, marginBottom:3}} >
                                        <Text style={{fontSize:19}} >|</Text>
                                    </View>
                                    <Text>Suggest Topic</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{justifyContent:"center", marginTop:height/39, flexDirection:"row"}}>
                                <TouchableOpacity style={{height:height/14, width:width/2.3,borderColor:"grey", elevation:1, borderRadius:3, justifyContent:"center", alignItems:"center", flexDirection:"row"}} onPress={async ()=>{await signOut(authx),x.navigation.replace("Login")}} >
                                    <FontAwesome5 name="sign-out-alt" size={23} color="grey" />
                                    <View style={{marginHorizontal:7, marginBottom:3}} >
                                        <Text style={{fontSize:19}} >|</Text>
                                    </View>
                                    <Text>Sign Out</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal transparent visible={visible2} animationType="fade" onRequestClose={hideModel2} >
                    <View style={{flex:1, backgroundColor:"rgba(0,0,0,0.5)", justifyContent:"center", alignItems:"center"}}>
                        <Animated.View style={{backgroundColor:"white", height:height/3, width:width/1.3, borderRadius:13, transform:[{translateY:viewPos}]}}>
                            <View style={{flexDirection:"row-reverse", marginTop:13, marginLeft:9}}>
                                <TouchableOpacity onPress={hideModel2} >
                                    <Entypo name="cross" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                            <View style={{justifyContent:"center",alignItems:"center"}} >
                                <Text style={{fontSize:15, fontStyle:"italic", fontWeight:"bold", color:"grey"}}>Your StandPoint</Text>
                                <View style={{width:width/3.3,height:0.5,backgroundColor:"grey"}} />
                            </View>
                            <View style={{justifyContent:"center",alignItems:"center", marginTop:height/23}} >
                                <View  style={{width:width/1.9,height:height/17,backgroundColor:"white", borderRadius:7, elevation:11, justifyContent:"center",alignItems:"center"}}>
                                    <TextInput 
                                        placeholder="StandPoint"
                                        value = {newStandpoint}
                                        style={{fontSize:11, fontStyle:"italic", paddingHorizontal:7}}
                                        onChangeText={newStandInputHandler}
                                        maxLength={73}
                                    />
                                </View>
                                <View style={{marginTop:height/23}} >
                                    {
                                        loading2 == false ? (
                                            <TouchableOpacity style={{width:width/7,height:height/14,backgroundColor:"yellow",borderRadius:1000,elevation:7, justifyContent:"center",alignItems:"center"}} onPress={tick} >
                                                <FontAwesome5 name="check-circle" size={24} color="black"/>
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={{width:width/7,height:height/14,backgroundColor:"grey",borderRadius:1000,elevation:7, justifyContent:"center",alignItems:"center"}} onPress={tick} >
                                                <Text style={{color:"white", fontWeight:"bold", bottom:3}} >...</Text>
                                            </View>
                                        )
                                    }
                                    
                                </View>
                            </View>
                        </Animated.View>
                    </View>
                </Modal>
            
            </ScrollView>
        )
    }


    async function refreshPage(){
        setRef(true)
        await getPosts()
        await getData()
        setRef(false)
    }

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








    // return(
    //     <View style={styles.container} >
    //         <TouchableOpacity style={{flex:1,position:"absolute", height:height/16,width:width/8, marginLeft:(width)-width/8-15, marginTop:15, borderColor:"grey", borderWidth:1,borderRadius:5, justifyContent:"center", alignItems:"center"}} onPress={async ()=>{await signOut(authx),x.navigation.replace("Login")}} >
    //             <FontAwesome5 name="sign-out-alt" size={23} color="grey" />
    //         </TouchableOpacity>
    //         <View style={{alignItems:"center", marginTop:30}}>
    //             <Image source={{uri:user.photoURL}} style={{height:height/3.5,width:width/1.9, borderRadius:500}} /> 
    //             <TouchableOpacity style={{position:"absolute" ,height:40,width:40, top:height/4.1,left:width/2+(width/7),justifyContent:"center",alignItems:"center"}} onPress={()=>{x.navigation.replace("uploadImage",{uid:user.uid})}} >
    //                     <AntDesign name="folder1" size={20} color="grey" />
    //             </TouchableOpacity>
    //         </View>
    //             <View style={{alignItems:"center"}} >
    //                 <View>
    //                         <View style={{borderColor:"lightGrey", borderWidth:0.9, height:height/17, width:width/1.5, borderRadius:20, marginTop:height/20,justifyContent:"center", alignItems:"center"}} >
    //                             <Text style={{ color:"grey", }} >{user.displayName}</Text>
    //                         </View>
    //                     {/* <TouchableOpacity style={{position:"absolute", width:30, height:30, marginTop:height/18+8, marginLeft:width/1.5+7}}>
    //                         <AntDesign name="setting" size={23} color="grey" />
    //                     </TouchableOpacity> */}
    //                 </View>
    //                         <View style={{borderColor:"lightGrey", borderWidth:0.9, height:height/17, width:width/1.5, borderRadius:20, marginTop:height/23,justifyContent:"center", alignItems:"center"}} >
    //                             <Text style={{ color:"grey", }} >{user.email}</Text>
    //                         </View>
    //                     <View style={{flexDirection:"row", marginTop:height/23,}} >
    //                         <Text style={{fontSize:18, fontStyle:"italic",fontWeight:"bold", bottom:-15}}>SUGGEST A TOPIC?</Text>
    //                         <TouchableOpacity style={{height:height/13, width:width/5, backgroundColor:"lightblue", marginLeft:15, borderRadius:15, justifyContent:"center", alignItems:"center"}} onPress={()=>{x.navigation.navigate("suggestTopic",{userName:user.displayName, uid:user.uid})}} >
    //                             <FontAwesome5 name="newspaper" size={24} color="black" />
    //                         </TouchableOpacity>
    //                     </View>
    //             </View>
    //     </View>
    // )

}

const styles = StyleSheet.create({
    container : {
        flex:1,
        backgroundColor:"white"
    }
})