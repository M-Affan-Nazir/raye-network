import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { io } from "socket.io-client";
import ip from "./constants"

import LoginStack from './navigation/navigation';
import addUserReducer from './redux/reducers/userProfile';
import addMainStackNav from './redux/reducers/mainStackNav';
import addUsersPosts from './redux/reducers/usersPosts';
import {createStore, combineReducers} from "redux"
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';

export const MainConSocketContext = React.createContext()

const rootReducer = combineReducers({
  usersData : addUserReducer,           //certain Slice! state looks like : {  usersData:{}  } 
  nav : addMainStackNav,
  usersPosts : addUsersPosts
})
const store = createStore(rootReducer)

export default function App() {

  const MainConSocket = io(ip+":3420")

  return (
    <Provider store={store} >
      <MainConSocketContext.Provider value={MainConSocket} >
        <View style={{flex:1}}>
          <LoginStack />
          <StatusBar backgroundColor='lightyellow'/>
        </View>
      </MainConSocketContext.Provider>
    </Provider>
  );
}
