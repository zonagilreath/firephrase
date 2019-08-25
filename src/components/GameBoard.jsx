import React from 'react';
import firebase from '../utils/firebaseConnection.js';
import LettersDisplay from './LettersDisplay.jsx';
import WordInput from './WordInput.jsx';
import SubmittedWordsList from './SubmittedWordsList.jsx';
import Timer from './Timer.jsx';

export default class GameBoard extends React.Component {
  constructor(props){
    super(props);
    this.db = firebase.firestore();
    console.log('chars in gameborad constructor',this.props.chars);
    this.state = {
      chars: '',
      unusedChars: [],
      currentInput: '',
      submittedWords: [],
    }
    this.submitWord = this.submitWord.bind(this)
    this.setUnusedChars = this.setUnusedChars.bind(this)
    this.inputChangeHandler = this.inputChangeHandler.bind(this)
    this.addLetterToInput = this.addLetterToInput.bind(this)
    this.removeLetterFromInput = this.removeLetterFromInput.bind(this)
  }

  componentDidMount(){
    
  }

  componentDidUpdate(){
    if (this.props.chars !== this.state.chars){
      this.setUnusedChars();
    }
  }

  setUnusedChars(){
    const chars = this.props.chars
    const unusedChars = chars.split('');
    this.setState({chars, unusedChars});
  }

  submitWord(e){
    e.preventDefault();
    if (this.state.currentInput.length > 0){
      this.db.runTransaction(tx => (
        tx.get(this.props.gameRef)
        .then(gameDoc => {
          const data = gameDoc.data();
          const newWord = this.state.currentInput;
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
        this.setUnusedChars();
        document.getElementById('wordInput').value = '';
        this.setState({currentInput: ''})
      });
    }
  }

  addLetterToInput(inputString){
    const newChar = inputString.charAt(inputString.length - 1);
    const charLocation = this.state.unusedChars.indexOf(newChar);
    console.log('charloc', charLocation);
    if (charLocation >= 0){
      const currentInput = this.state.currentInput + newChar;
      console.log(currentInput);
      const unusedChars = [
        ...this.state.unusedChars.slice(0, charLocation),
        ...this.state.unusedChars.slice(charLocation + 1)
      ]
      document.getElementById('wordInput').value = currentInput;
      this.setState({currentInput, unusedChars});
    }else{
      document.getElementById('wordInput').value = this.state.currentInput;
    }
  }

  removeLetterFromInput(inputString){
    const removedLetter = this.state.currentInput.charAt(inputString.length);
    const currentInput = inputString;
    const unusedChars = this.state.unusedChars.concat(removedLetter);
    this.setState({currentInput, unusedChars})
  }

  inputChangeHandler(e){
    console.log('input changed!');
    console.log(e.target.value.length);
    console.log(this.state.currentInput.length);
    const inputString = e.target.value.toUpperCase();
    if (e.target.value.length > this.state.currentInput.length){
      this.addLetterToInput(inputString)
    }else{
      this.removeLetterFromInput(inputString)
    }
  }

  render(){
    return (
      <div>
        <LettersDisplay unusedChars={this.state.unusedChars}/>
        <WordInput
          submitWord={this.submitWord}
          inputChangeHandler={this.inputChangeHandler} />
      </div>
    )
  }
}
