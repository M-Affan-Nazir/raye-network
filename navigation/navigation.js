import React, {useLayoutEffect, useState} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import { authx } from '../db/firebase';
import { onAuthStateChanged} from 'firebase/auth';
import { Animated, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


import Login from '../screens/login';
import SignUp from '../screens/signUp';
import NewsFeed from '../screens/newsFeed';
import LoadingScreen from '../screens/loading';
import Debate from '../screens/debate';
import Profile from '../screens/profile';
import SuggestTopic from '../screens/suggestTopic';
import UploadImage from '../screens/uploadImage';
import ChattersProfile from '../screens/chatersProfile';
import HolderDebate from '../screens/holderDebate';
import SupportList from '../screens/supportList';
import SaySomething from '../screens/saySomething';
import Announce from "../screens/announce"
import Search from '../screens/search';
import GetLettersReceive from '../screens/getLettersReceive';
import GetLettersSent from '../screens/getLettersSent';
import SendLetter from '../screens/sendLetter';


import { Octicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

const LoginStack = () => {

    const [loggedIn, setLoggedIn] = useState()
    const getUser = async () => {
        await onAuthStateChanged(authx, (user)=>{
            if(user){
               setLoggedIn(true)
            } else {
                setLoggedIn(false)
            }
        })
    }

    useLayoutEffect(()=>{
        getUser()
    })

    if(loggedIn == null){
        return (
            <LoadingScreen />
        )
    }
    else {
        return (
            <NavigationContainer>
            <Stack.Navigator>
                {
                    loggedIn == false &&
                    <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
                }
                {
                    loggedIn == false && 
                    <Stack.Screen name="SignUp" component={SignUp} options={{title:"Account"}} />
                }
                <Stack.Screen name="Home" component={TabNav} options={{headerShown:false}} />
                <Stack.Screen name="chat" component={HolderDebate}/>
                <Stack.Screen name="suggestTopic" component={SuggestTopic} options={{title:"Suggestion"}} />
                <Stack.Screen name="uploadImage" component={UploadImage} options={{title:"Upload", headerShown:false}} />
                <Stack.Screen name="chattersProfile" component={ChattersProfile} options={{title:""}} />
                <Stack.Screen name="supportList" component={SupportList} />
                <Stack.Screen name="saySomething" component={SaySomething} options={{headerShown:false}} />
                <Stack.Screen name="announce" component={Announce} options={{headerShown:false}} />
                <Stack.Screen name="search" component={Search} options={{headerShown:false}} />
                <Stack.Screen name="sendLetter" component={SendLetter} options={{headerShown:false}} />
            </Stack.Navigator>
            </NavigationContainer>
        )
    }
}



const TabNav = () => {

    const YValue = useState(new Animated.Value(500))[0]
    const fader = () => {
        Animated.timing(YValue, {
            toValue:0,
            duration:1000,
            useNativeDriver:true
        }).start()
    }
    fader()

    return(
        <Tab.Navigator 
            tabBarOptions={{showLabel:false}}
            screenOptions={{
                tabBarStyle:{
                    position:"absolute",
                    bottom:10,  //35
                    left:49,    //63
                    right:49,
                    height: 45,
                    backgroundColor:"yellow",
                    borderRadius:20,
                    transform: [{translateY :YValue }]
                }
            }}
        >
            <Tab.Screen name='NewsFeed' component={NewsFeed} 
                options={{
                    tabBarIcon : ({focused}) => {
                        return(
                            <Octicons name="flame" size={20} color={focused ? "black" : "grey" } />
                        )
                    },
                    title:"Raye"
                }}
            />
            <Tab.Screen 
                name="Letters" component={LettersTopTabNav} 
                options={{
                tabBarIcon : ({focused}) => {
                    return(
                        <View style={{marginBottom:2}} >
                            <FontAwesome5 name="paper-plane" size={17.7} color={focused ? "black" : "grey" }  />
                        </View>
                    )
                    },
                    title:"Letters"
                }}
            />
            <Tab.Screen name='Debate' component={Debate} 
                options={{
                    tabBarIcon : ({focused}) => {
                        return(
                            <View style={{width:55,height:55, borderRadius:30, backgroundColor:"white", top:-20, justifyContent:"center", alignItems:"center", borderColor:"black", borderWidth:1.5}} >
                                <FontAwesome5 name="pen" size={20} color={focused ? "black" : "grey" } />
                            </View>
                        )
                    },
                    title:"Raye"
                }}
            />
            <Tab.Screen name='search' component={Search} 
                options={{
                    tabBarIcon : ({focused}) => {
                        return(
                            <View style={{marginBottom:2}} >
                                <EvilIcons name="search" size={29} color={focused ? "black" : "grey" }  />
                            </View>
                        )
                    },
                    title:"Raye"
                }}
            />
            <Tab.Screen name='Profile' component={Profile} 
                options={{
                    tabBarIcon : ({focused}) => {
                        return(
                            <Ionicons name="person-circle-sharp" size={26} color={focused ? "black" : "grey" } />
                        )
                    }
                }}
            />
        </Tab.Navigator>
    )
}

const LettersTopTabNav = () => {
    return(
        <TopTab.Navigator tabBarOptions={{
                                        showLabel:false,
                                        indicatorStyle:{backgroundColor:"black"}
                                        }} >
            <TopTab.Screen name="lettersReceived" component={GetLettersReceive} 
                options={{
                    tabBarIcon:({focused})=>{
                        return(
                            <View>
                                <EvilIcons name="arrow-down" size={29} color={focused ? "black" : "grey" } />
                            </View>   
                        )
                    },
                    title:"Received"
                }} 
            />
            <TopTab.Screen name="lettersSent" component={GetLettersSent} 
                options={{
                    tabBarIcon:({focused})=>{
                        return(
                            <View>
                                <EvilIcons name="arrow-up" size={29} color={focused ? "black" : "grey" } />
                            </View>   
                        )
                    },
                    title:"Sent"
                }} 
            />
        </TopTab.Navigator>
    )
}

export default LoginStack


//tabBarStyle: { display: 'none' }