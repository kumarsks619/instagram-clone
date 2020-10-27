import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAW9DG37RIE4yCcsC2DuPp-FZWA8kRXono",
    authDomain: "instagram-clone-5d1c4.firebaseapp.com",
    databaseURL: "https://instagram-clone-5d1c4.firebaseio.com",
    projectId: "instagram-clone-5d1c4",
    storageBucket: "instagram-clone-5d1c4.appspot.com",
    messagingSenderId: "581830541564",
    appId: "1:581830541564:web:5942814449df729e845779",
    measurementId: "G-W43SMSPXCV"
})



const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()


export { db, auth, storage }

