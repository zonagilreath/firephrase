import React from 'react';
import PlayersList from './components/PlayersList.jsx';
import SubmittedWordsList from './components/SubmittedWordsList.jsx';
import GameBoard from './components/GameBoard.jsx';
import firebase from './utils/firebaseConnection.js';
import generateCharSet from './utils/charsGenerator.js'; 


export default class App extends React.Component{
  constructor(props){
    super(props);
    this.db = firebase.firestore();
    this.state = {
      gameId: 'McSpglLzSV9zTc2suoPD',
      playerName: '',
      playerId: '',
      players: [],
      chars: '',
      submittedWords: [],
    }
  }

  componentDidMount(){
    console.log(window.location.href);
    this.getChars()
    
  }

  connectToGame(gameId){
    this.db.runTransaction(tx => (
      tx.get(this.db.collection('games').doc(gameId))
      .then(gameDoc => {
        if (!gameDoc.exists){
          this.setState()
        }
      })
    ))
  }

  getChars(){
    const gameRef = this.db.collection('games').doc(this.state.gameId);
    const chars = generateCharSet();
    const submittedWords = [];
    gameRef.update({chars, submittedWords})
    .then(()=>{
      console.log("Document updated");
      this.setState({chars})
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }

  render(){
    return (
      <React.Fragment>
        <PlayersList players={this.state.players} />
        <GameBoard
          chars={this.state.chars}
          gameRef={this.db.collection('games').doc(this.state.gameId)}/>
      </React.Fragment>
    )
  }
}