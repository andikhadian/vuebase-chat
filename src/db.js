import firebase from 'firebase/app'
import 'firebase/database'

const config = {
    apiKey: "AIzaSyDo-9rlIzhOPE44PaOuqfOeweQBe0kGnXQ",
    authDomain: "chat-vue-270e4.firebaseapp.com",
    projectId: "chat-vue-270e4",
    storageBucket: "chat-vue-270e4.appspot.com",
    messagingSenderId: "784601588778",
    appId: "1:784601588778:web:6d7a4980ac2ece44188f53"
}

const db = firebase.initializeApp(config)

export default db