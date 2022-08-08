import React, {useState, useLayoutEffect} from "react";
import { View, StyleSheet, ActivityIndicator, FlatList, Animated, Dimensions, ScrollView, TouchableOpacity, RefreshControl} from "react-native";
import {dbx} from "../db/firebase"
import { collection, onSnapshot} from "firebase/firestore";
import ip from "../constants"
import { authx } from "../db/firebase";
import { useDispatch } from "react-redux";
import { addUserProfile } from "../redux/actions/userProfile";
import { addMainStackNav } from "../redux/actions/mainStackNav";
import { EvilIcons } from '@expo/vector-icons';
import JWT from 'expo-jwt';

import SaySomethingComp from "../components/saySomethingComponent";
import AnnouncementComp from "../components/announcementComponent";
import SharePostUnavailable from "../components/sharepostUnavailable";

import Feed from "../components/feed"

const {width, height} = Dimensions.get("window")

export default function NewsFeed(x) {

    const [feeds, setFeeds] = useState()
    const [fetchNews,setFetchNews] = useState()
    let [loaded, setLoaded] = useState(false)
    const [combined, setCombined] = useState([])
    const [postFeed,setPostFeed] = useState(null)
    const [ref,setRef] = useState(false)
    
    const dispatch = useDispatch()

    useLayoutEffect(()=>{
        if(loaded == false){
            // x.navigation.setOptions({
            //     headerRight : () => {
            //         return(
            //             <TouchableOpacity style={{marginRight:13}} onPress={() => x.navigation.navigate("search")}>
            //                 <EvilIcons name="search" size={29} color="black" />
            //             </TouchableOpacity>
            //         )
            //     }
            // })
            getUserData()
            getFeed()
            return (
              getNews(),
              setLoaded(true)
            )}
      }) 
    
    async function getNews(){
        const unsub = onSnapshot(collection(dbx, "feed"), (snap)=>{
            const data = snap.docs.map(docx => docx.data())
            setFeeds(data)})
        const unsub2 = fetch(ip+":8003/getNews").then(res => res.json()).then(res=> setFetchNews(res))
        return (
            unsub,
            unsub2
        )
    }

      const YValue = useState(new Animated.Value(1000))[0]
      const fader = () => {
        Animated.spring(YValue, {
            toValue:0,
            duration:1000,
            useNativeDriver:true
        }).start()
    }

    async function getUserData() {
            try{
                dispatch(addMainStackNav(x.navigation))
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
            dispatch(addUserProfile(data)) //dispatch (use the Action Function) --> Action function has action type (also has payload data) --> redux autonatically looks for appropriate reducer in its combineReducer's using Action-Functions "action type "" -->  Reducer called and Logic executed
            } catch (e) {
                console.warn(e)
            }
    }

    async function getFeed(){
        try{
            const token = JWT.encode(authx.currentUser.uid, "secretKey");
            const data = await (await fetch(ip+":8010/getFeed", {
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
           setPostFeed(data)
            
        }
        catch(e){
            console.warn(e)
        }
    }

    const Combiner = () => {
        if(fetchNews || feeds){
            feeds.map((x)=>{
                combined.push({imageUrl : x.imageUrl,
                                headline : x.headline,
                                info : x.info,
                                article : x.article
                                })
            })        
            }
            fetchNews.map((x)=>{
                combined.push({imageUrl:x.image,
                                headline : x.title,
                                info:x.description,
                                article:x.url
                                })
            })
        }

      if(!feeds || !fetchNews){
        return(
            <View style={{flex:1, backgroundColor:"white", alignItems:"center", justifyContent:"center"}}>
                <ActivityIndicator size="large" color="black" />
            </View>
        )
    }  else{
        fader()
        Combiner()
          return(
                  <Animated.View style={{flex:1, justifyContent:"center", alignItems:"center", transform:[{translateY:YValue}]}}>
                        <ScrollView
                           refreshControl={
                                <RefreshControl 
                                    refreshing={ref}
                                    onRefresh={refreshPage}
                                />
                            }
                        >
                            <FlatList 
                                showsVerticalScrollIndicator={false}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={combined}
                                renderItem={({item}) => <Feed
                                            imageUrl={item.imageUrl}
                                            headline={item.headline}
                                            info={item.info}
                                            articleUrl={item.article}
                                />}
                                keyExtractor={(item, index) => { return(index.toString())}} 
                                ListFooterComponentStyle={{flex:1, justifyContent: 'flex-end'}}
                                ListFooterComponent={<View style={{height:100}} 
                            />}
                            />
                            

                    {
                    postFeed == null ? (
                        <View style={{justifyContent:"center",alignItems:"center", marginBottom:height/4.7, top:40}} >
                            <ActivityIndicator size="large" color="black" />
                        </View>
                    ):
                    (
                        <FlatList 
                                showsVerticalScrollIndicator={false}
                                data={postFeed}
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
                                ListFooterComponent={<View style={{height:83}} 
                                                    />}
                                ListHeaderComponent={<View style={{height:5}} 
                                                    />}
                        />   
                    )
                }
                </ScrollView>
                  </Animated.View>
                )
    }  

    async function refreshPage(){
        setRef(true)
        await getFeed()
        await getNews()
        Combiner()
        setRef(false)
    }

}
