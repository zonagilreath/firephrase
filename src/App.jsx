import React from 'react';
import PlayersList from './components/PlayersList.jsx';
import SubmittedWordsList from './components/SubmittedWordsList.jsx';
import JoinGame from './components/JoinGame.jsx';
import CreateGame from './components/CreateGame.jsx';
import WaitingRoom from './components/WaitingRoom.jsx';
import GameBoard from './components/GameBoard.jsx';
import firebase from './utils/firebaseConnection.js';
import generateCharSet from './utils/charsGenerator.js'; 


export default class App extends React.Component{
  constructor(props){
    super(props);
    this.db = firebase.firestore();
    this.state = {
      gameId: '',
      gameRef: null,
      creatingGame: false,
      joiningGame: false,
      gameExists: false,
      gameStarted: false,
      playerIsGameCreator: false,
      playerName: '',
      players: [],
      chars: '',
      submittedWords: [],
    }
    this.playerJoin = this.playerJoin.bind(this);
    this.createGame = this.createGame.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  componentDidMount(){
    const [possibleGameId] = window.location.href.split('/').slice(-1);
    if (!possibleGameId){
      this.setState({creatingGame: true})
    } else{
      this.connectToGame(possibleGameId)
    }
  }

  connectToGame(gameId){
    //check url for gameId, join if present else prompt to create game
    this.db.collection('games').doc(gameId).get().then(gameDoc => {
      if (!gameDoc.exists){
        this.setState({creatingGame: true})
      }else{
        const gameRef = this.db.collection('games').doc(gameId);
        this.setState({joiningGame: true, gameId, gameRef})
      }
    })
  }

  playerJoin(playerName){
    // open a transaction on the database
    // read current game doc and check if playerName already exists
    // if not add player and launch GameBoard
    console.log(playerName);
    this.db.runTransaction(tx => (
      tx.get(this.state.gameRef)
      .then(gameDoc => {
        const data = gameDoc.data();
        if (data.players.includes(playerName)){
          throw 'Name is taken!'
        }
        const players = data.players.concat(playerName);
        tx.update(this.state.gameRef, {players})
      })
    ))
    .then(()=>{
      console.log('player joined');
      this.setState({
        playerName,
        joiningGame: false,
        gameExists: true
      })
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  createGame(playerName){
    const playerScores = {};
    playerScores[playerName] = 0;
    this.db.collection('games').add({
      creatorPlayer: playerName,
      players: [playerName],
      playerScores
    })
    .then(gameRef => {
      this.setState({
        gameId: gameRef.id,
        gameRef: gameRef,
        creatingGame: false,
        gameExists: true,
        playerIsGameCreator: true,
        playerName
      })
    })
    .catch(err => {
      console.error(err);
    })
  }

  startGame(){

  }

  getChars(){
    const gameRef = this.state.gameRef;
    const chars = generateCharSet();
    const submittedWords = [];
    gameRef.update({chars, submittedWords})
    .then(()=>{
      console.log("word submitted");
      this.setState({chars})
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }

  render(){
    if (this.state.creatingGame){
      return <CreateGame
              createGame={this.createGame} />
    }else if (this.state.joiningGame){
      return <JoinGame
              playerJoin={this.playerJoin}
              gameRef={this.state.gameRef}/>
    }else if (this.state.gameExists){
      if (this.state.gameStarted){
        return (
          <React.Fragment>
            <PlayersList players={this.state.players} />
            <GameBoard
              chars={this.state.chars}
              gameRef={this.db.collection('games').doc(this.state.gameId)}/>
          </React.Fragment>
        )
      }else{
        return <WaitingRoom
                isCreator={this.state.playerIsGameCreator}
                startGame={this.startGame}/>
      }
    }else {
      return (
        <h1>Loading</h1>
      )
    }
  }
}