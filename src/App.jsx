import React from 'react';
import firebase from './utils/firebaseConnection.js';
import generateCharSet from './utils/charsGenerator.js'; 


export default class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      chars: '',
      charsList: []
    }
  }

  componentDidMount(){
    this.getChars()
  }

  getChars(){
    const db = firebase.firestore().collection('charsets');
    const chars = generateCharSet();
    db.add({chars})
    .then((docRef)=>{
      console.log("Document written with ID: ", docRef.id);
    })
    .then(()=>(db.get()))
    .then(querySnap => {
      const charsList = [];
      querySnap.forEach(doc => {
        console.log(doc.data());
        charsList.push(doc.data())})
      return this.setState({chars, charsList})
    })
    .then(()=>console.log(this.state))
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }

  render(){
    return (<h1>{this.state.chars}</h1>)
  }
}