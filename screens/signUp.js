import React,{useState, useLayoutEffect} from 'react'
import {View,Text, StyleSheet, Image, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Animated, Alert, ActivityIndicator} from 'react-native'

import { FontAwesome5 } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import {updateProfile} from 'firebase/auth'
import { authx, dbx } from '../db/firebase';
import ip from "../constants"

const {width, height} = Dimensions.get("window")

export default function SignUp() {

    const [userName, setUserName] = useState("")
    const [insignia, setInsignia] = useState("")
    const [email, setEmail] = useState("")
    const [pwd, setPwd] = useState("")
    const [loading, setLoading] = useState(true)

    const userNameSetter = (x) => {
        setUserName(x.replace(/[0-9-#*;,.<>"'!@$%^&()?:+_=`~\{\}\[\]\\\/]/g,''))
    }

    const emailSetter = (x) => {
        setEmail(x.replace(/[" "]/g,''))
    }

    const pwdSetter = (x) => {
        setPwd(x)
    }

    const insigniaSetter = (x) => {
        setInsignia(x.replace(/[" "-#*;,<>"'!@$%^&()?:+=`~\{\}\[\]\-\\\/]/g,'').toLowerCase())
    }


    const viewPos = useState(new Animated.Value(600))[0]
    useLayoutEffect(()=>{
        Animated.timing(viewPos, {
            toValue:0,
            duration:700,
            useNativeDriver:true
        }).start()
    })


    async function verifyInsignia(){
        try{
            const data = await (await fetch(ip+":8005/verifyInsignia/"+insignia )).json()
            data
            return data.code
            
        } catch (e) {
            console.warn(e)
        }
    }

    const createUser = async() => {
        let currentUID;
        let currentUser
        try {
            setLoading(false)
            const result = await verifyInsignia()
            if(result==2){
                setLoading(true)
                Alert.alert("Insignia not Available","The insignia is already in use. Try using a more unique insignia")
                return;
            }
            if(result == 0){
                setLoading(true)
                Alert.alert("That's Strange","An Unexpected Error occured. Try checking your network connection. If problem still persists, contact us at assist.raye@outlook.com")
                return;
            }
            await createUserWithEmailAndPassword(authx, email, pwd)
            await onAuthStateChanged(authx, (user)=>{
                currentUID = user.uid
                currentUser = user
            })
            // await setDoc(doc(dbx, "users", currentUID), {
            //     uid:currentUID,
            //     name : userName,
            //     email: email,
            //     password: pwd
            // });
            const data = await (await fetch(ip+":8005/createUser", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uid : currentUID,
                    avatar : "https://firebasestorage.googleapis.com/v0/b/raye-db1.appspot.com/o/raye-default.jpg?alt=media&token=56063de2-8280-49da-ac0b-0ae1834486d8",
                    userName: userName,
                    userInsignia:insignia, 
                    email:email,
                    password:pwd
                    
                })
            })).json()
            data
            await updateProfile(currentUser, {displayName:userName, email:email, photoURL:"https://firebasestorage.googleapis.com/v0/b/raye-db1.appspot.com/o/raye-default.jpg?alt=media&token=56063de2-8280-49da-ac0b-0ae1834486d8"})
            setUserName("")
            setPwd("")
            setEmail("")
            setLoading(true)
        }
        catch(error){
           if(error.code == "auth/email-already-in-use"){
               setLoading(true)
               Alert.alert("Email Not Available", "A User with that Email already exists. Please Use a different Email")
           } else if(error.code == "auth/invalid-email") {
               setLoading(true)
               Alert.alert("Invalid Email", "Please use a valid Email Address")
           } else {
               console.warn(error.code)
           }
        }
    }

    const signUpPen = () => {
        if(!userName || !email || !pwd || !insignia){
            Alert.alert("Please Fill All Fields")
        } else {
            if(pwd.length < 8 && userName.length < 3 ){
                Alert.alert("UserName And Password Too Short", "Please use your Real Name And make sure the password is atleast 8 charaters")
            }
            else if(insignia.length < 5){
                Alert.alert("Insignia Too short","Insignia should be greater than 4 characters")
            }
            else if(pwd.length < 8) {
                Alert.alert("Short Password", "Password should be atleast 8 characters")
            }
            else if(userName.length < 3){
                Alert.alert("Short UserName", "Please use your real name")
            }
            else {
                createUser()
            }
        }
    }

    return(
        <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}} >
        <KeyboardAvoidingView style={{flex:1,backgroundColor:"white"}} behavior="position" >
            <View style={{alignItems:"center", marginTop:height/11}}>
                <Image source={require("../assets/own/splash.png")} style={{width:width/2, height:height/4}} />
            </View>
            {
                loading ? 
                            <Animated.View style={{transform:[{translateY:viewPos}]}}>
                            <View style={{marginTop:20}}>
                                <TextInput 
                                        placeholder='User Name' 
                                        style={styles.textInput} 
                                        autoFocus={false} 
                                        value={userName}
                                        onChangeText={userNameSetter}
                                        maxLength={15}
                                        />
                                <TextInput 
                                        placeholder='Unique Insignia' 
                                        value={insignia}
                                        onChangeText={insigniaSetter}
                                        autoCapitalize="none"
                                        autoComplete="off"
                                        autoCorrect={false}
                                        style={styles.textInput} 
                                        maxLength={15}
                                        />
                                <TextInput 
                                        placeholder='Email' 
                                        style={styles.textInput}
                                        keyboardType='email-address' 
                                        value={email}
                                        onChangeText={emailSetter}
                                        />
                                <TextInput 
                                        placeholder='Password' 
                                        style={styles.textInput} 
                                        secureTextEntry={true}
                                        value={pwd}
                                        onChangeText={pwdSetter}
                                        />
                            </View>
                            <View>
                                <TouchableOpacity  style={{width:90, height:60, backgroundColor:"yellow", borderRadius:30, marginHorizontal:width/1.45, marginTop:25, justifyContent:"center", alignItems:"center"}} onPress={signUpPen}>
                                        <FontAwesome5 name="pen" size={23} color="black" />
                                </TouchableOpacity>
                                <View style={{marginTop:-height/19, marginHorizontal:width/2.9, borderBottomColor:"lightgrey", borderBottomWidth:1}}>
                                    <Text style={{fontSize:17, fontWeight:"bold", color:"grey"}}>Drop Some Ink</Text>
                                </View>
                            </View>
                            </Animated.View> 
                        :
                            <View style={{marginTop:90}} >
                                <ActivityIndicator size="large" color="black" />
                                <Text style={{fontSize:14, fontWeight:"bold", marginTop:13, marginLeft:width/2.45}}>Please Wait...</Text>
                            </View> 
            }
            
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )

}

const styles = StyleSheet.create({
    textInput : {
        height:50,
        borderRadius:25,
        borderWidth:0.5,
        marginHorizontal:30,
        paddingLeft:25,
        marginVertical:9,
        borderColor:'rgba(0,0,0,0.7)',
    }
})