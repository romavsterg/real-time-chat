import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyBPoYcNFACvSXp-sTEjqI8uXChJJZ0u-O8",
  authDomain: "real-time-chat-be592.firebaseapp.com",
  databaseURL: "https://real-time-chat-be592-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "real-time-chat-be592",
  storageBucket: "real-time-chat-be592.appspot.com",
  messagingSenderId: "912700025063",
  appId: "1:912700025063:web:0f65c83712478c8ead5a42",
  measurementId: "G-Y3KG2K1RJ8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export const Context = createContext(null)

const auth = firebase.auth()

const db = firebase.database()
const chatsRef = db.ref("chats")
// const newMessageRef =  messagesRef.push()
// newMessageRef.set({
//   user1Id: "HBG7JpaiE2NZaoHSzZfN1C24SgX2",
//   user2Id: "ILkSTPYo5NbvllexVwl3T26KbpY2"
// })

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context.Provider value={{
    firebase,
    auth,
    chatsRef
  }}>
    <App />
  </Context.Provider>
);

export {auth}