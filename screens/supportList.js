import React,{useLayoutEffect, useState} from "react";
import {View, Text, Dimensions, Image, ActivityIndicator, FlatList, TouchableOpacity} from "react-native"
import ip from "../constants"
import { authx } from "../db/firebase";
import { Entypo } from '@expo/vector-icons';

const {width, height} = Dimensions.get("window")

export default function SupportList(x){

    const [list, setList] = useState(-1);
    const [loaded, setLoaded] = useState(false)

    useLayoutEffect(()=>{
        x.navigation.setOptions({title:  x.route.params.user})
        getList()
    })

    async function getList() {
        if(loaded == false && x.route.params.code == 1){
            const data = await (await fetch(ip+":8004/getSupporters/" +x.route.params.uid)).json()
            data
            setList(data);
            setLoaded(true)
        }
        if(loaded == false && x.route.params.code == 2){
            const data = await (await fetch(ip+":8004/getSupporting/" +x.route.params.uid)).json()
            data
            setList(data);
            setLoaded(true)
        }

    }

    if(list == -1) {
        return (
            <View style={{flex:1, backgroundColor:"white", alignItems:"center", justifyContent:"center"}}>
                <ActivityIndicator size="large" color="black" />
            </View>
        )
    }
    else { 
        if(list.length > 0){
            return(
                <View style={{flex:1, backgroundColor:"white"}} >
                    <View style={{justifyContent:"center", alignItems:"center", marginTop:17}} >
                        <FlatList 
                            data={list}
                            showsVerticalScrollIndicator={true}
                            renderItem={({item}) => {
                                return ( 
                                        <UserComp 
                                            image={item.avatar}
                                            insignia={item.insignia}
                                            userName = {item.userName}
                                            standPoint = {item.standPoint}
                                            uid={item.uid}
                                            navigation={x.navigation}
                                        />
                                )
                            }}
                            keyExtractor={(item, index) => { return(index.toString())}} 
                        />
                   </View>
                </View>
            )
        }
        else{
            return(
                <View style={{justifyContent:"center",alignItems:"center", backgroundColor:"white", flex:1}} >
                    <Entypo name="feather" size={47} color="grey" />
                </View>
            )
        }
    }

    function jump(uid,name) {
        if(uid != authx.currentUser.uid){
            x.navigation.replace("chattersProfile",{user:name, uid:uid})
        }
    }


    function UserComp(y) {
        return(
            <View style={{}} >
                <View style={{flexDirection:"row", marginHorizontal:width/23, marginVertical:height/57}}>
                    <View style={{backgroundColor:"#D8D7D6", width:width/5, height:height/10, position:"absolute", borderRadius:1000}} />
                    <TouchableOpacity style={{height:height/10,width:width/5, borderRadius:1000}} onPress={()=>{jump(y.uid,y.userName)}} >
                    <Image source={{uri:y.image}} style={{height:height/10,width:width/5, borderRadius:1000}} />
                    </TouchableOpacity>
                    <View style={{justifyContent:"center", paddingLeft:15 }}>
                        <Text style={{fontSize:17}}>{y.insignia}</Text>
                        <Text style={{fontSize:11, color:"grey"}}>{y.userName}</Text>
                    </View>
                    {
                        y.uid != authx.currentUser.uid && (
                        <View style={{marginHorizontal:12, flexDirection:"row", alignItems:"center", width:width/2.5}} >
                            <View style={{height:height/21, width:3, backgroundColor:"black", marginRight:15}} />
                            <Text style={{fontStyle:"italic",fontSize:12, fontWeight:"bold",}}>" {y.standPoint} "</Text>
                        </View>
                        )
                    }
                </View>
                <View style={{width:width/2, height:0.5, backgroundColor:"lightgrey", elevation:2, marginLeft:15, marginLeft:width/3.5}} />
           </View>
        )
    }

}