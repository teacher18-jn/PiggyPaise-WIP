import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyD_m4mBp9iqjT0SwCsOWrApUX-qwlJqD9g",
  authDomain: "piggy-paise---2.firebaseapp.com",
  projectId: "piggy-paise---2",
  storageBucket: "piggy-paise---2.appspot.com",
  messagingSenderId: "99975140743",
  appId: "1:99975140743:web:fe7ac3ce48eb23dcbb2f22"
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export default firebase.database()