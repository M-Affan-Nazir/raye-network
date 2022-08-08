import React from "react";
import { Text, View, StyleSheet, Image, Dimensions, ActivityIndicator} from "react-native"

const {width, height} = Dimensions.get("window")

export default function LoadingScreen() {

    return (
        <View style={styles.container} >
            <Image source={require("../assets/own/splash.png")} style={{width:width/2, height:height/4}} />
        </View>
    )

}

const styles = StyleSheet.create({
    container : {
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    }
})