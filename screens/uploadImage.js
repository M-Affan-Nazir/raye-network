import React, {useLayoutEffect, useState} from "react";
import { View, Text, StyleSheet, Image, Button, ActivityIndicator} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Entypo } from '@expo/vector-icons';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {updateProfile} from 'firebase/auth'
import { authx } from '../db/firebase';
import ip from "../constants"

const storage = getStorage();

export default function UploadImage(x) {

    const [asked, setAsked] = useState(false)

    useLayoutEffect(()=>{
        if(!asked){
            pickImage()
            setAsked(true)
        }
    })

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
        if (!result.cancelled) {
            const r = await fetch(result.uri);
            const b = await r.blob();
            const fileExt = result.uri.substring(result.uri.lastIndexOf('.') + 1);
            const fileRef = ref(storage, "usersProfile/"+x.route.params.uid+"."+fileExt);
            await uploadBytes(fileRef,b)
            const url = await getDownloadURL(fileRef)
            await updateProfile(authx.currentUser,{photoURL:url})
            const data = await (await fetch(ip+":8005/updateImage", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                   uid:authx.currentUser.uid,
                   url:url
                })
            })).json()
            data
            // x.navigation.replace("Home")
            x.navigation.pop(1);
        } else{
            //x.navigation.replace("Home")
            x.navigation.pop(1);
        }
    };

    return(
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Entypo name="image" size={70   } color="black" />
            <ActivityIndicator size="large" color="black" style={{marginTop:20}} />
            <Text style={{marginTop:20,fontWeight:"bold"}}>Please Wait...</Text>
        </View>
    )

}