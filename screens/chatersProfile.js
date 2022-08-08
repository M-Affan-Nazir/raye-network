import React,{useLayoutEffect, useState} from "react";
import { View, Text, StyleSheet, Image, Dimensions, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, FlatList} from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { authx } from "../db/firebase";
import ip from "../constants"
import JWT from 'expo-jwt';

import SaySomethingComp from "../components/saySomethingComponent";
import AnnouncementComp from "../components/announcementComponent";
import SharePostUnavailable from "../components/sharepostUnavailable";

const {width, height} = Dimensions.get("window")

export default function ChattersProfile(x) {

    const [supporters, setSupporters] = useState(-1);
    const [supporting, setSupporting] = useState(-1);
    const [isFollowing, setIsFollowing] = useState(-1)
    const [userData,setUserData] = useState()
    const [loaded, setLoaded] = useState(false)
    const [loadButton, setLoadButton] = useState(false)
    const [posts, setPosts] = useState(null)

    useLayoutEffect(()=>{
            getUserData()
    })

    async function getUserData() {
        if(!loaded){
            try{
                const data = await (await fetch(ip+":8006/getUserData", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uid: x.route.params.uid,
                    uidUser : authx.currentUser.uid
                })
            })).json()
            data
                setUserData(data)
                setSupporters(data.supportersNumber)
                setSupporting(data.supportingNumber)
                setIsFollowing(data.following)
                x.navigation.setOptions({title:"@ " + data.userInsignia})
                getPosts()
            } catch (e) {
                console.warn(e)
            }
        }
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
                    uid : x.route.params.uid
                })
            })).json()
            data;
            setPosts(data)
            setLoaded(true)
        }
        catch(e){
            console.warn(e)
        }
    }

    async function follow (){
        try{
            setLoadButton(true)
            const data = await (await fetch(ip+":8004/support", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isfollowingUID : authx.currentUser.uid,
                    gettingfollowedUID : x.route.params.uid
                })
            })).json()
            data
            if(data.code == 1){
                setIsFollowing(1)
                setSupporters(s => s+1)
                setLoadButton(false)
            }
        } catch(e) {
            console.warn(e)
            setLoadButton(false)
        }
    }


    async function unfollow() {
        try{
            setLoadButton(true)
            const data = await (await fetch(ip+":8004/desupport", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    desupportUID: x.route.params.uid,
                    desupportingUID : authx.currentUser.uid
                })
            })).json()
            data
            if(data.code == 1){
                setIsFollowing(0)
                setSupporters(s => s-1)
                setLoadButton(false)
            }
        }catch(e){
            console.warn(e)
            setLoadButton(false)
        }
    }

    function jump(y){
        if(y == 1){
            x.navigation.replace("supportList",{code:1, user:userData.userName, uid:userData.uid})
        } else {
            x.navigation.replace("supportList",{code:2, user:userData.userName, uid:userData.uid})
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
            <ScrollView style={styles.container} >
                <View style={{flexDirection:"row"}} >
                    <View style={{height:height/7.5, width:width/4, backgroundColor:"#98A206", borderRadius:1000, marginTop: 30, marginLeft:17, position:"absolute" }} />
                    <Image source={{uri:userData.avatar}} 
                        style={{height: height/7.5, width:width/4, borderRadius:1000, marginTop: 30, marginLeft:17}}
                    />
                    <View style={{marginTop: 47, marginLeft:width/20, height:height/12, width:width/6, alignItems:"center"}}>
                        <Text style={{fontSize:23, fontWeight:"bold"}}>{userData.totalPosts}</Text>
                        <Text style={{fontSize:13}}>Posts</Text>
                    </View>
                    <TouchableOpacity style={{marginTop: 47, marginLeft:15, height:height/12, width:width/6, alignItems:"center"}} onPress={()=>{jump(1)}} >
                        <Text style={{fontSize:23, fontWeight:"bold"}}>{supporters}</Text>
                        <Text style={{fontSize:13}}>Supporters</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginTop: 47, marginLeft:17, height:height/12, width:width/6, alignItems:"center"}} onPress={()=>{jump(2)}} >
                        <Text style={{fontSize:23, fontWeight:"bold"}}>{supporting}</Text>
                        <Text style={{fontSize:13}}>Supporting</Text>
                    </TouchableOpacity>
                </View>
    
                    <View style={{flexDirection:"row"}}>
                        <View style={{marginTop: 11, marginLeft:width/15}}>
                            <Text style={{fontSize:17.5, fontWeight:"bold", color:"grey"}} >{userData.userName}</Text>
                        </View>
                        <View style={{justifyContent:"flex-end", flex:1, marginRight:33, flexDirection:"row"}}>
                            <TouchableOpacity style={{backgroundColor:"black", height:height/21, width:width/5, marginTop: 7, marginRight:20 ,borderRadius:20, alignItems:"center", justifyContent:"center"}} onPress={()=>{x.navigation.navigate("sendLetter",{avatar:userData.avatar,uid:userData.uid, userName:userData.userName,userInsignia:userData.userInsignia})}} >
                                <FontAwesome5 name="paper-plane" size={17} color="white" />
                            </TouchableOpacity>
                            {isFollowing == 0 && !loadButton ? (
                                <TouchableOpacity style={{backgroundColor:"black", height:height/21, width:width/5, marginTop: 7, borderRadius:20, alignItems:"center", justifyContent:"center"}} onPress={follow} >
                                    <Text style={{color:"white"}}>Follow</Text>
                                </TouchableOpacity>
                            ) : isFollowing == 1 && !loadButton ?
                                (
                                    <TouchableOpacity style={{backgroundColor:"yellow", height:height/21, width:width/5, marginTop: 7, borderRadius:20, alignItems:"center", justifyContent:"center", paddingLeft:5}} onPress={unfollow} >
                                        <FontAwesome5 name="user-check" size={15} color="black" />
                                    </TouchableOpacity>
                                ) : (
                                    <View style={{backgroundColor:"grey", height:height/21, width:width/5, marginTop: 7, borderRadius:20, alignItems:"center", justifyContent:"center", paddingBottom:7}}>
                                        <Text style={{color:"white", fontSize:20, fontWeight:"bold"}}>...</Text>
                                    </View>
                                )
                            }
                        </View>
                    </View>
                    <View style={{alignItems:"center", marginTop:height/29, marginHorizontal:width/15}} >
                        <Text style={{fontWeight:"bold", fontStyle:"italic", fontSize:14.5}}>" {userData.standPoint} "</Text>
                    </View>

                <View style={{alignItems:"center", marginTop:height/23, marginHorizontal:width/8}}>
                    <View style={{backgroundColor:"lightgrey", height:1, width:"100%"}}></View>
                </View>
                


                {
                    posts == null ? (
                        <View style={{justifyContent:"center",alignItems:"center", marginTop:height/7}} >
                            <ActivityIndicator size="large" color="black" />
                        </View>
                    ) :
                    posts[0] == undefined ? (
                        <View style={{justifyContent:"center",alignItems:"center", marginTop:height/5}}>
                            <View style={{flexDirection:"row"}} >
                                <Entypo name="feather" size={39} color="grey" />
                                <FontAwesome5 name="wind" size={19} color="grey" />
                            </View>
                            <Text style={{fontSize:11.5, color:"grey", marginTop:10}} >{userData.userName} has no Raye yet</Text>
                        </View>
                    ) :
                    (
                        <FlatList 
                                showsVerticalScrollIndicator={false}
                                data={posts}
                                renderItem={({item}) => {
                                    if(item.postType == "saySomething"){
                                        return(
                                            <SaySomethingComp data={item} />
                                        )
                                    }
                                    else if(item.postType == "announcement"){
                                        return(
                                            <AnnouncementComp data={item} />
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
                                                <AnnouncementComp data={item} />
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
                                ListFooterComponent={<View style={{height:45}} 
                                                    />}
                        />   
                    )
                }







            </ScrollView>
        )
    }





//     return(
//         <View style={styles.container} >
//             <View style={{alignItems:"center", marginTop:-250}}>
//                 <Image source={{uri:x.route.params.avatar}} style={{height:height/3.5,width:width/1.9, borderRadius:500}} /> 
//             </View>
//             <View style={{alignItems:"center"}} >
//                     <View>
//                             <View style={{borderColor:"black", borderWidth:0.9, height:height/17, width:width/1.5, borderRadius:10, marginTop:height/20,justifyContent:"center", alignItems:"center"}} >
//                                 <Text style={{ color:"black", }} >{x.route.params.user}</Text>
//                             </View>
//                     </View>
//                 </View>
//         </View>
//     )

}

const styles = StyleSheet.create({
    container : {
        flex:1,
        backgroundColor:"white"
    }
})