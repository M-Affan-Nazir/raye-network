import React, { useState } from 'react'
import {View, Text, StyleSheet, Image, Dimensions, TouchableWithoutFeedback, Animated, TextInput, Keyboard, TouchableOpacity, Alert, ActivityIndicator} from 'react-native'
import {signInWithEmailAndPassword} from "firebase/auth"
import {authx} from "../db/firebase"

const {width, height} = Dimensions.get("window")
const widthx = width
const heightx = height


export default function LoginCmp (x) {

    const [email, setEmail] = useState("")
    const [pwd, setPwd] = useState("")
    const [loading, setLoading] = useState(true)

    const emailSetter = (x) => {
        setEmail(x.replace(/[" "]/g,''))
    }

    const pwdSetter = (x) => {
        setPwd(x)
    }

    const fadeValue = useState(new Animated.Value(1))[0]
    const fallValue = useState(new Animated.Value(0))[0]
    const bgValue = useState(new Animated.Value(0))[0]
    const loginOpacity = useState(new Animated.Value(0))[0]
    const zIndex = useState(new Animated.Value(-1))[0]
    const loginUpslide = useState(new Animated.Value(height/3))[0]

    const fade = async() => {
        Animated.timing(fadeValue, {
            toValue:0,
            duration:400,
            useNativeDriver:true,
        }).start()
        Animated.timing(fallValue, {
            toValue:1200,
            duration:1000,
            useNativeDriver:true,
        }).start()
        Animated.timing(bgValue, {
            toValue: -height/3,
            duration:1000,
            useNativeDriver:true
        }).start()
        Animated.timing(loginOpacity, {
            toValue:1,
            duration:1000,
            useNativeDriver:true
        }).start()
        Animated.timing(zIndex, {
            toValue:1,
            duration:1000,
            useNativeDriver:true
        }).start()
        Animated.timing(loginUpslide, {
            toValue: 0,
            duration:1000,
            useNativeDriver:true
        }).start()
    }

    const fadeOut = () => {
        Animated.timing(fadeValue, {
            toValue:1,
            duration:400,
            useNativeDriver:true,
        }).start()
        Animated.timing(fallValue, {
            toValue:0,
            duration:1000,
            useNativeDriver:true,
        }).start()
        Animated.timing(bgValue, {
            toValue: 0,
            duration:1000,
            useNativeDriver:true
        }).start()
        Animated.timing(loginOpacity, {
            toValue:0,
            duration:1000,
            useNativeDriver:true
        }).start()
        Animated.timing(zIndex, {
            toValue:-1,
            duration:1000,
            useNativeDriver:true
        }).start()
        Animated.timing(loginUpslide, {
            toValue: height/3,
            duration:1000,
            useNativeDriver:true
        }).start()
        Keyboard.dismiss()
    }

    const logIn = async() => {
        if(!email || !pwd){
            Alert.alert("Please Enter Credentials")
        }
        else {
            try {
                setLoading(false)
                await signInWithEmailAndPassword(authx, email, pwd)
                setLoading(true)
                setEmail("")
                setPwd("")
            }
            catch(error){
                if(error.code=="auth/wrong-password"){
                    setLoading(true)
                    Alert.alert("Incorrect Password", "The Password you entered is Incorrect. Please Try Again.")
                    setPwd("")
                } else {
                    setLoading(true)
                    Alert.alert("Can't Find Account", 
                                "Account does not seem to match any existing Accounts. If you dont have one, you can create an Account",
                                [
                                    {
                                        text:"Create An Account",
                                        onPress: x.toSignUp
                                    },
                                    {
                                        text: "Ok"
                                    }
                                ]
                                )
                    setPwd("")
                }
            }
        }
    }


    return(
        <View style={{flex:1,justifyContent:"flex-end"}}>

            <Animated.View style={{...StyleSheet.absoluteFill, transform:[{translateY:bgValue}]}}>
                <Image 
                source={require("../assets/own/bg.png")} 
                style={{flex:1,height:null,width:null, flexDirection:"column"}}
                />
            </Animated.View>
            <View style={{marginHorizontal:width/12, marginVertical:height/7}}>
                <Image source={require("../assets/own/raye.png")} style={{width: width,height: 200}} />
            </View>

            <View style={{ height:heightx/3, justifyContent:"center"}}>
                    <TouchableWithoutFeedback onPress={fade}>
                        <Animated.View style={{...styles.button,opacity:1, borderWidth:2,borderColor:"black", opacity:fadeValue, transform:[{translateY:fallValue}]}}>
                            <Text style={{fontSize:20, fontWeight:"bold"}}> LOG IN </Text>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={x.toSignUp}>
                        <Animated.View style={{...styles.button, backgroundColor:"black", opacity:fadeValue, transform:[{translateY:fallValue}]}}>
                            <Text style={{fontSize:20, fontWeight:"bold", color:"white"}}> SIGN UP </Text>
                        </Animated.View>
                    </TouchableWithoutFeedback>
            </View>

            {
                loading ? 
                            <Animated.View style={{height:height/3, ...StyleSheet.absoluteFill, top:null, justifyContent:"center", zIndex:zIndex, opacity:loginOpacity, transform:[{translateY:loginUpslide}]}}> 
                            <TouchableWithoutFeedback onPress={fadeOut}>
                                <View style={styles.closeButton}>
                                    <Text style={{fontSize:15}}>X</Text>
                                </View>
                            </TouchableWithoutFeedback>             
                            <TextInput 
                                placeholder='Email'
                                style={styles.textinput}
                                placeholderTextColor="black"
                                value={email}
                                onChangeText={emailSetter}
                                keyboardType="email-address"
                            />
                            <TextInput 
                                placeholder='Password'
                                style={styles.textinput}
                                placeholderTextColor="black"
                                value={pwd}
                                secureTextEntry={true}
                                onChangeText={pwdSetter}
                            />
                            <TouchableOpacity style={{height:heightx/11,marginHorizontal:20,borderRadius:35,marginVertical : 5}} onPress={logIn} >
                            <Animated.View style={styles.loginButton}>
                                <Text style={{fontSize:20, fontWeight:"bold"}}> SIGN IN </Text>
                            </Animated.View>
                            </TouchableOpacity>
                            </Animated.View> 
                        : 
                            <View style={{height:height/3, ...StyleSheet.absoluteFill, top:null, justifyContent:"center", alignItems:"center"}}>
                            <ActivityIndicator size="large" color="darkgrey" />
                            <Text style={{fontSize:14, fontWeight:"bold", marginTop:13}}>Loading...</Text>
                            </View>
            }
            
        </View>
    )

}

const styles = StyleSheet.create({
    button:{
        backgroundColor:"white",
        height:heightx/11,
        marginHorizontal:20,
        borderRadius:35,
        alignItems:"center",
        justifyContent:"center",
        marginVertical : 5,
        borderColor:"black",
        borderWidth:2,
    },
    textinput : {
        height:50,
        borderRadius:25,
        borderWidth:0.5,
        marginHorizontal:20,
        paddingLeft:25,
        marginVertical:5,
        borderColor:'rgba(0,0,0,0.2)'
    },
    loginButton : {
        backgroundColor:"white",
        height:heightx/11,
        marginHorizontal:20,
        borderRadius:35,
        alignItems:"center",
        justifyContent:"center",
        marginVertical : 5,
        borderColor:"lightgrey",
        elevation:3,
        borderWidth:0.7
    },
    closeButton: {
        height:40,
        width:40,
        backgroundColor:"white",
        borderRadius:20,
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        top:-18,
        left:width/2-20,
        elevation:3
    }
})