import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCipwDSYzIJS5HvxG1qmh_BWvxW6B7z6SE",
  authDomain: "fire-phrase.firebaseapp.com",
  databaseURL: "https://fire-phrase.firebaseio.com",
  projectId: "fire-phrase",
  storageBucket: "",
  messagingSenderId: "847509687974",
  appId: "1:847509687974:web:2a0888147399c608"
};
firebase.initializeApp(firebaseConfig);
export default firebase;