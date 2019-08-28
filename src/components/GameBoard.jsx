import React from 'react';
import firebase from '../utils/firebaseConnection.js';
import generateCharSet from '../utils/charsGenerator.js'; 
import letterPoints from '../utils/letterPoints.js';
import PlayersList from './PlayersList.jsx';
import LettersDisplay from './LettersDisplay.jsx';
import WordInput from './WordInput.jsx';
import SubmittedWordsList from './SubmittedWordsList.jsx';
import Timer from './Timer.jsx';
import Grid from '@material-ui/core/Grid';

export default class GameBoard extends React.Component {
  constructor(props){
    super(props);
    this.db = firebase.firestore();
    this.submitWord = this.submitWord.bind(this)
    this.setUnusedChars = this.setUnusedChars.bind(this)
    this.inputChangeHandler = this.inputChangeHandler.bind(this)
    this.addLetterToInput = this.addLetterToInput.bind(this)
    this.removeLetterFromInput = this.removeLetterFromInput.bind(this)
    this.countDown = this.countDown.bind(this)
    this.timerId = 0;
    this.state = {
      gameId: this.props.gameId,
      gameRef: this.props.gameRef,
      playerName: this.props.playerName,
      players: this.props.players,
      playerScores: {},
      chars: this.props.chars,
      unusedChars: this.setUnusedChars(this.props.chars, true),
      currentInput: '',
      submittedWords: [],
      remainingTime: 120,
    }
  }

  componentDidMount(){
    // listen for new words and score updates
    this.state.gameRef.onSnapshot(doc => {
      const data = doc.data();
      const submittedWords = data.submittedWords;
      const playerScores = data.playerScores;
      this.setState({submittedWords, playerScores})
    })
    this.timerId = setInterval(this.countDown, 1000)
  }

  countDown(){
    // decrement time every second
    // clear interval and game when mtime runs out
    const oldTime = this.state.remainingTime;
    const remainingTime = oldTime - 1;
    if (remainingTime <= 0){
      clearInterval(this.timerId);
      this.props.gameOver(this.state.playerScores);
    }else{
      this.setState({remainingTime});
    }
  }

  setUnusedChars(chars, noUpdate){
    if (!chars){
      chars = this.state.chars;
    }
    const unusedChars = chars.split('');
    if (noUpdate){
      return unusedChars;
    }
    this.setState({chars, unusedChars, currentInput: ''});
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
          const playerScores = data.playerScores
          for (let letter of newWord){
            playerScores[this.state.playerName] += letterPoints[letter.toLowerCase()]
          }
          const updatedWords = data.submittedWords.concat(newWord);
          tx.update(this.props.gameRef, {playerScores, submittedWords: updatedWords})
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
        this.setUnusedChars();
      });
    }
  }

  addLetterToInput(inputString){
    const newChar = inputString.charAt(inputString.length - 1);
    const charLocation = this.state.unusedChars.indexOf(newChar);
    if (charLocation >= 0){
      const currentInput = this.state.currentInput + newChar;
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
    const inputString = e.target.value.toUpperCase();
    if (e.target.value.length > this.state.currentInput.length){
      this.addLetterToInput(inputString)
    }else{
      this.removeLetterFromInput(inputString)
    }
  }


  render(){
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center">
        <PlayersList
          players={this.state.players}
          playerScores={this.state.playerScores}/>
        <Timer time={this.state.remainingTime}/>
        <LettersDisplay unusedChars={this.state.unusedChars}/>
        <WordInput
          submitWord={this.submitWord}
          inputChangeHandler={this.inputChangeHandler} />
        <SubmittedWordsList words={this.state.submittedWords} />
      </Grid>
    )
  }
}
