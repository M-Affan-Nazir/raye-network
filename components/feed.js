import React, {useState} from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Modal, ActivityIndicator} from "react-native";
import WebView from "react-native-webview";

import { Ionicons } from '@expo/vector-icons';


const {width, height} = Dimensions.get("window")

export default function Feed(x) {

    const [visible, setVisible] = useState(false)

    const modalBackButton = () => {
        setVisible(false)
    }
    const feedPress = () => {
        setVisible(true)
    }

    // let info = x.info
    // if(x.info.length > 193 ){
    //     info = x.info.slice(0,190) + "..."
    // }
    // let headline = x.headline
    // if(x.headline.length > 34 ){
    //     headline = x.headline.slice(0,32) + ".."
    // }

    return(
        <View style={styles.container} >
            <TouchableOpacity onPress={feedPress} >
               <View>
                   <View style={{borderTopLeftRadius:23,borderTopRightRadius:23,height:height/3.9, width:width/1.2, backgroundColor:"#FEFBB1",elevation:1}} >
                    <Image 
                        source={{uri:x.imageUrl}} 
                        style={{borderTopLeftRadius:23,borderTopRightRadius:23,height:height/3.9, width:width/1.2}}    
                    />
                    </View>
                    <View style={{height:height/6, width:width/1.2, backgroundColor:"white", borderBottomLeftRadius:23, borderBottomRightRadius:23,elevation:1}} >
                        <View style={{height:"23%", marginTop:6, marginLeft:7}}>
                            <Text style={{fontSize:20, fontWeight:"bold"}}>{x.headline}</Text>
                        </View>
                        <View style={{flex:1, marginHorizontal:10, marginTop:3, marginBottom:5}}>
                            <Text style={{fontSize:13, color:"grey"}}>{x.info}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

            <Modal visible={visible} animationType="slide" onRequestClose={modalBackButton} >
                <View style={{flexDirection:"row"}}>
                <TouchableOpacity style={{height:50, width:50, backgroundColor:"white", marginLeft:10, marginTop:15, borderRadius:30, borderBottomColor:"grey", borderWidth:1, justifyContent:"center", alignItems:"center", marginBottom:10}} onPress={modalBackButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={{marginTop:25, flex:1, alignItems:"flex-end", marginRight:15}}>
                <Text style={{fontSize:19}} >NEWS FEED</Text>
                </View>
                </View>
                <WebView  
                    source={{ uri: x.articleUrl }}
                    renderLoading={()=>{
                        return(
                            <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                                <ActivityIndicator size="large" color="black" />
                            </View>
                        )
                    }}
                    startInLoadingState
                />
            </Modal>

        </View>
    )

}

const styles = StyleSheet.create({
    container : {
        flex:1,
        marginTop:30,
        marginHorizontal:11,
    }
})


