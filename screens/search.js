import React,{useState} from "react";
import { View,Text, TouchableOpacity, Dimensions, TextInput, ActivityIndicator, Keyboard,FlatList, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import JWT from 'expo-jwt';
import { authx } from "../db/firebase";
import ip from "../constants"

const {width, height} = Dimensions.get("window")


export default function Search(x){

    const [searchText, setSearchText] = useState()
    const [theState,setTheState] = useState("none")
    const [result,setResult] = useState(null)
    const [notFoundText, setNotFoundText] = useState("")
    
    return(
        <View style={{flex:1, backgroundColor:"white"}} >
            {/* <TouchableOpacity style={{position:"absolute", marginTop:height/7, marginLeft:width/19}} onPress={goBack}  >
                <Ionicons name="arrow-back-sharp" size={24} color="black" />
            </TouchableOpacity> */}
            <View style={{flex:1,marginLeft:width/7, flexDirection:"row", right:9}} >
                <TextInput 
                    placeholder="Search"
                    style={{width:width/1.7,height:height/19, backgroundColor:"white", borderBottomColor:"grey",borderBottomWidth:1}}
                    autoFocus
                    value={searchText}
                    onChangeText={changeText}
                />
                <TouchableOpacity style={{height:height/22,width:width/7,backgroundColor:"white", marginTop:9, marginLeft:17, borderRadius:5, borderColor:"grey",borderWidth:0.7, justifyContent:"center",alignItems:"center"}} disabled={theState == "loading" ? true : false} onPress={search}>
                    <EvilIcons name="search" size={25} color="black" />
                </TouchableOpacity>
            </View>
            {
                (theState == "loading") ? (
                    <View style={{position:"absolute", marginTop:height/2, marginLeft:width/2.15}} >
                        <ActivityIndicator size="large" color="black" />
                    </View>
                )
                : (theState == "notFound") ? (
                    <View style={{flex:1, alignItems:"center"}}>
                        <View style={{marginBottom:15,flexDirection:"row"}} >
                            <FontAwesome name="search" size={24} color="grey" />
                        </View>
                        <Text style={{color:"grey",fontWeight:"bold"}}>No Results found for "{notFoundText}"</Text>
                    </View>
                ) : (<View />)
            }

            {
                result != null && (
                    <View style={{position:"absolute", marginTop:height/11}} >
                                            <FlatList 
                                                data={result}
                                                showsVerticalScrollIndicator={false}
                                                renderItem={({item}) => {
                                                    return ( 
                                                            <UserComp 
                                                                image={item.avatar}
                                                                insignia={item.userInsignia}
                                                                userName = {item.userName}
                                                                standPoint = {item.standPoint}
                                                                uid={item.uid}
                                                            />
                                                    )
                                                }}
                                                keyExtractor={(item, index) => { return(index.toString())}} 
                                            />
                    </View>
                )
            }

        </View>
    )

    function goBack(){
        x.navigation.pop(1);
    }

    function changeText(x){
        setSearchText(x)
    }

    async function search(){
        Keyboard.dismiss()
        setNotFoundText(searchText)
        if(searchText.length > 0){
            try{
                setResult(null)
                setTheState("loading")
                const token = JWT.encode(authx.currentUser.uid, "secretKey");
                const data = await (await fetch(ip+":8010/search", {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        key : token,
                        search : searchText
                    })
                })).json()
                data;
                if(data.length > 0){
                    setTheState("none")
                    setResult(data)
                    setNotFoundText("")
                }
                else{
                    setTheState("notFound")
                    setResult(null)
                }
            }
            catch(e){
                console.warn(e)
            }
        }
    }

    function UserComp(y){
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
                <View style={{width:width/2, height:0.5, backgroundColor:"lightgrey", elevation:2, marginLeft:width/3.5}} />
           </View>
        )
    
    }

    function jump(uid,name) {
        if(uid != authx.currentUser.uid){
            x.navigation.navigate("chattersProfile",{user:name, uid:uid})
        }
    }

}