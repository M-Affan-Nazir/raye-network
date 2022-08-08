import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import { getAuth} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAkn0cePxtP3VfRL3_zc-CQ_mal9bHlm_A",
  authDomain: "raye-db1.firebaseapp.com",
  projectId: "raye-db1",
  storageBucket: "raye-db1.appspot.com",
  messagingSenderId: "564616544197",
  appId: "1:564616544197:web:278d5549cb625f28c915ac"
};


initializeApp(firebaseConfig);
export const authx = getAuth();
export const dbx = getFirestore();