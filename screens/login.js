import { StyleSheet, View } from 'react-native';
import React, {useState}  from 'react';

import { Asset } from 'expo-asset';
import AppLoading from 'expo-app-loading';

import LoginCmp from '../components/loginComp';

function cacheImages(images) {
    return images.map(image => {
      if (typeof image === 'string') {
        return Image.prefetch(image);
      } else {
        return Asset.fromModule(image).downloadAsync();
      }
    });
  }
  
  
  export default function Login(x) {

    const toSignUp = () => {
      x.navigation.navigate("SignUp")
    }
  
    const [isReady, setIsReady] = useState(false)
  
    async function _loadAssetsAsync() {
      const imageAssets = cacheImages([
        require('../assets/own/bg.png'),
      ]);
  
      await Promise.all([...imageAssets]);
    }
  
    if (isReady) {
      return (
        <AppLoading
          startAsync={_loadAssetsAsync}
          onFinish={()=> setIsReady(false)}
        />
      );
    }
     
    return (
        <View style={styles.container}>
          <LoginCmp toSignUp={toSignUp} />
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
      },
    });