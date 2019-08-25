// import React from 'react';
// import firebase from '../utils/firebaseConnection.js';
// import generateCharSet from '../utils/charsGenerator.js'; 
// 
// export default function connectToFirebase(){
//   const db = firebase.firestore();
//   const chars = generateCharSet();
//   db.collection('charsets').add({chars})
//   .then(function(docRef) {
//     console.log("Document written with ID: ", docRef.id);
//     return (<h2>{chars}</h2>)
//   })
//   .catch(function(error) {
//     console.error("Error adding document: ", error);
//   });
// }