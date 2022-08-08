import React from "react";
import { View, StyleSheet,Dimensions, Image, Text, TouchableOpacity} from "react-native";

import { FontAwesome5 } from '@expo/vector-icons';

const {width, height} = Dimensions.get("window")

export default function DebateComp(x) {

    return(
        <View style={styles.container} >
            <View style={{height:height/3.9, width:width/1.2, backgroundColor:"white", borderTopLeftRadius:23, borderTopRightRadius:23, elevation:1}}>
                 <Image 
                        source={{uri:x.imageUrl}} 
                        style={{borderTopLeftRadius:23,borderTopRightRadius:23,height:height/3.9, width:width/1.2}}    
                    />
            </View>
            <View style={{height:height/2.5, width:width/1.2 ,backgroundColor:"white", borderBottomLeftRadius:23, borderBottomRightRadius:23, elevation:1}}>
                <View style={{height:"15%", backgroundColor:"white", justifyContent:"center", marginLeft:7,}} >
                    <Text style={{fontSize:18, fontWeight:"bold", textDecorationLine:"underline"}}>{x.title}</Text>
                </View>
                <View style={{height:"10%", backgroundColor:"white", alignItems:"center", marginLeft:7, flexDirection:"row"}}>
                    <Text style={{fontWeight:"bold", textDecorationLine:"underline"}}>RANK</Text>
                    <Text style={{fontWeight:"bold"}}> : </Text>
                    <Text style={{fontWeight:"bold", color:"#83A4FF"}}>{x.rank}</Text>
                </View>
                <View style={{height:"13%", backgroundColor:"white",  alignItems:"center", marginLeft:7, flexDirection:"row"}}>
                    <Text style={{fontWeight:"bold", textDecorationLine:"underline"}}>INTENSITY</Text>
                    <Text style={{fontWeight:"bold"}}> : </Text>
                    <Text style={{fontWeight:"bold", color:"red"}}>{x.intensity}</Text>
                </View>
                <View style={{flex:1, height:"40%" ,backgroundColor:"white", marginLeft:7, flexDirection:"row"}}>
                    <Text style={{fontWeight:"bold", textDecorationLine:"underline", marginTop:4}}>BACKGROUND</Text>
                    <Text style={{fontWeight:"bold", marginTop:4}}> : </Text>
                    <Text style={{flex:1,marginTop:4, color:"grey",marginRight:5}}>{x.background}</Text>
                </View>
                <View style={{flex:1, alignItems:"flex-end"}} >
                        <TouchableOpacity style={{width:70, height:50, backgroundColor:"yellow", borderRadius:25, marginHorizontal:20, marginVertical:20, justifyContent:"center", alignItems:"center"}} onPress={()=> x.parentParam.navigation.navigate("chat",{dbCollectionChat:x.dbCollectionChat, screenName : x.title})} >
                            <FontAwesome5 name="pen" size={15} color="black" />
                        </TouchableOpacity>
                </View>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container : {
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        marginTop:20
    }
})