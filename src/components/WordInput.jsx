import React from 'react';
import firebase from '../utils/firebaseConnection.js';

export default class WordInput extends React.Component {
  constructor(props){
    super(props);
    this.db = firebase.firestore();
    this.state = {
      currentInput: ''
    }
    this.submitWord = this.submitWord.bind(this)
    this.inputChangeHandler = this.inputChangeHandler.bind(this)
  }

  submitWord(e){
    e.preventDefault();
    console.log(this.state.currentInput);
    this.db.runTransaction(tx => (
      tx.get(this.props.gameRef)
      .then(gameDoc => {
        const data = gameDoc.data();
        const newWord = this.state.currentInput
        if (data.submittedWords.includes(newWord)){
          throw 'Word already submitted!'
        }
        const updatedWords = data.submittedWords.concat(newWord);
        tx.update(this.props.gameRef, {submittedWords: updatedWords})
      })
    ))
    .then(()=>{
      console.log('word submitted!');
    })
    .catch((err)=>{
      console.log(err);
    })
    .then(()=>{
      document.getElementById('wordInput').value = '';
      this.setState({currentInput: ''})
    })
  }

  inputChangeHandler(e){
    this.setState({currentInput: e.target.value})
  }

  render(){
    return (
      <form onSubmit={this.submitWord}>
        <input id='wordInput' type='text' onChange={this.inputChangeHandler} />
      </form>
    )
  }
}