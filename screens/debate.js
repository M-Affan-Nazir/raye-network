import React, {useState, useLayoutEffect, useEffect} from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Animated} from "react-native";
import { collection, onSnapshot} from "firebase/firestore";

import DebateComp from "../components/debateComp";
import { dbx } from "../db/firebase";

export default function Debate(x) {
    
    const [inkpot, setInkpot] = useState()
    let [loaded, setLoaded] = useState(false)

    useLayoutEffect(()=>{
        if(loaded == false){
            const unsub = onSnapshot(collection(dbx, "inkpot"), (snap)=>{
                const data = snap.docs.map(docx => docx.data())
                setInkpot(data)})
            return (unsub,
            setLoaded(true))
        }
    })

    const YValue = useState(new Animated.Value(1000))[0]
      const fader = () => {
        Animated.spring(YValue, {
            toValue:0,
            duration:1000,
            useNativeDriver:true
        }).start()
    }

    if(!inkpot){
        return(
            <View style={{flex:1, backgroundColor:"white", alignItems:"center", justifyContent:"center"}}>
                <ActivityIndicator size="large" color="black" />
            </View>
        )
    } else {
        fader()
        return(
            <Animated.View style={{flex:1, transform:[{translateY:YValue}]}} >
                <FlatList 
                    showsVerticalScrollIndicator={false}
                    data={inkpot}
                    renderItem={({item}) => <DebateComp 
                                                parentParam={x}
                                                title={item.title}
                                                rank={item.rank}
                                                intensity={item.intensity}
                                                imageUrl={item.imageUrl}
                                                background={item.background}
                                                dbCollectionChat={item.dbCollectionChat}
                                            /> }
                                            keyExtractor={(item, index) => { return(index.toString())}}
                                            ListFooterComponentStyle={{flex:1, justifyContent: 'flex-end'}}
                                            ListFooterComponent={<View style={{height:100}}/> }
                />
            </Animated.View>
        )
    }


}
