import React from 'react';
import PlayersList from './components/PlayersList.jsx';
import SubmittedWordsList from './components/SubmittedWordsList.jsx';
import JoinGame from './components/JoinGame.jsx';
import CreateGame from './components/CreateGame.jsx';
import GameBoard from './components/GameBoard.jsx';
import firebase from './utils/firebaseConnection.js';
import generateCharSet from './utils/charsGenerator.js'; 


export default class App extends React.Component{
  constructor(props){
    super(props);
    this.db = firebase.firestore();
    this.state = {
      gameId: '',
      creatingGame: false,
      joiningGame: false,
      playerName: '',
      playerId: '',
      players: [],
      chars: '',
      submittedWords: [],
    }
  }

  componentDidMount(){
    const [possibleGameId] = window.location.href.split('/').slice(-1);
    if (!possibleGameId){
      console.log('got nothin boss!');
      this.setState({creatingGame: true})
    } else{
      this.connectToGame(possibleGameId)
      // this.getChars()
    }
    
  }

  connectToGame(gameId){
    this.db.collection('games').doc(gameId).get().then(gameDoc => {
      if (!gameDoc.exists){
        this.setState({creatingGame: true})
      }else{
        this.setState({joiningGame: true, gameId})
      }
    })
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
    if (this.state.creatingGame){
      return <CreateGame />
    }else if (this.state.joiningGame){
      return <JoinGame />
    }else if (this.state.gameExists){
      return (
        <React.Fragment>
          <PlayersList players={this.state.players} />
          <GameBoard
            chars={this.state.chars}
            gameRef={this.db.collection('games').doc(this.state.gameId)}/>
        </React.Fragment>
      )
    }else {
      return (
        <h1>welcome</h1>
      )
    }
  }
}