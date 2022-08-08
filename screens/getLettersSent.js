import React,{useState, useLayoutEffect} from "react";
import {View,Text, FlatList, ActivityIndicator,Dimensions, RefreshControl, ScrollView} from 'react-native'

import { authx } from "../db/firebase";
import ip from "../constants";
import JWT from 'expo-jwt';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import LetterComp from "../components/letter";

const {width, height} = Dimensions.get("window")

export default function GetLettersReceive(x){

    const [letters, setLetters] = useState(null)
    const [loaded,setLoaded] = useState(false)
    const [ref,setRef] = useState(false)

    useLayoutEffect(()=>{
        if(loaded == false){
            getLetters()
        }
    })

    if(letters == null){
        return(
            <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"white"}} >
                <ActivityIndicator size="large" color="black" />
            </View>
        )
    }
    else{
        return(
            <ScrollView 
                contentContainerStyle={{flex:1,justifyContent:"center",alignItems:"center", backgroundColor:"white"}}
                refreshControl={
                    <RefreshControl 
                        refreshing={ref}
                        onRefresh={refreshPage}
                    />
                }
            >

                {
                    letters.length == 0 && (
                        <View style={{flex:1, marginTop:height/2.75, alignItems:"center"}} >
                            <MaterialCommunityIcons name="email-outline" size={31} color="grey" />
                            <Text style={{color:"grey",fontSize:13,fontStyle:"italic"}}>No Letters Sent</Text>
                        </View>
                    )
                }

                <FlatList 
                    showsVerticalScrollIndicator={false}
                    data={letters}
                    renderItem={({item}) => {
                                    return(
                                        <LetterComp data={item} type={"sent"} />
                                    )
                                }}
                    keyExtractor={(item, index) => { return(index.toString())}} 
                    ListFooterComponentStyle={{flex:1, justifyContent: 'flex-end'}}
                    ListFooterComponent={<View style={{height:45}} 
                                        />}
                />   
            </ScrollView>
        )
    }

    async function refreshPage(){
        setRef(true)
        await getLetters()
        setRef(false)
    }


    async function getLetters(){
        const token = JWT.encode(authx.currentUser.uid, "secretKey");
                const data = await (await fetch(ip+":8012/getSentLetter", {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        key : token,
                    })
                })).json()
                data;
                setLetters(data)
                setLoaded(true)
    }
}