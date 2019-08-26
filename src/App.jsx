import React from 'react';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import PlayersList from './components/PlayersList.jsx';
import SubmittedWordsList from './components/SubmittedWordsList.jsx';
import JoinGame from './components/JoinGame.jsx';
import CreateGame from './components/CreateGame.jsx';
import WaitingRoom from './components/WaitingRoom.jsx';
import GameBoard from './components/GameBoard.jsx';
import GameOver from './components/GameOver.jsx';
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
      gameOver: false,
      playerIsGameCreator: false,
      playerName: '',
      players: [],
      playerScores: {},
      chars: '',
      submittedWords: [],
    }
    this.playerJoin = this.playerJoin.bind(this);
    this.createGame = this.createGame.bind(this);
    this.startGame = this.startGame.bind(this);
    this.gameOver = this.gameOver.bind(this);
  }

  componentDidMount(){
    // check url path for gameId, try to join with game id 
    const [possibleGameId] = window.location.href.split('/').slice(-1);
    if (!possibleGameId){
      this.setState({creatingGame: true})
    } else{
      this.connectToGame(possibleGameId)
    }
  }

  componentDidUpdate(_, prevState){
    // add firestore listener for new players, game start, and char set
    if (this.state.gameRef){
      this.state.gameRef.onSnapshot(doc => {
        const data = doc.data();
        const players = data.players;
        const gameStarted = data.gameStarted;
        const chars = data.chars;
        if (prevState.players.length !== players.length ||
            prevState.gameStarted !== gameStarted){
          this.setState({players, gameStarted, chars})
        }
      })
    }
  }

  createGame(playerName){
    const playerScores = {};
    playerScores[playerName] = 0;
    this.db.collection('games').add({
      creatorPlayer: playerName,
      players: [playerName],
      chars: '',
      submittedWords: [],
      playerScores
    })
    .then(gameRef => {
      this.setState({
        gameId: gameRef.id,
        gameRef: gameRef,
        creatingGame: false,
        gameExists: true,
        playerIsGameCreator: true,
        gameStarted: false,
        playerName
      })
    })
    .catch(err => {
      console.error(err);
    })
  }

  startGame(){
    const chars = generateCharSet();
    this.state.gameRef.update({chars, gameStarted: true})
    .then(()=>{
      console.log("chars posted");
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
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
    // if not add player to player lists and scores map and launch GameBoard
    this.db.runTransaction(tx => (
      tx.get(this.state.gameRef)
      .then(gameDoc => {
        const data = gameDoc.data();
        if (data.players.includes(playerName)){
          throw 'Name is taken!'
        }
        const players = data.players.concat(playerName);
        const playerScores = data.playerScores;
        playerScores[playerName] = 0;
        tx.update(this.state.gameRef, {players, playerScores})
      })
    ))
    .then(()=>{
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

  gameOver(playerScores){
    this.setState({gameOver: true, gameExists: false, playerScores});
  }

  render(){
    // render views conditionally based on game state
    return (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="md">
          {(this.state.creatingGame) ? (
            <CreateGame createGame={this.createGame} />
          ) : (this.state.joiningGame ) ? (
            <JoinGame
              playerJoin={this.playerJoin}
              gameRef={this.state.gameRef}/>
          ) : (this.state.gameExists && this.state.gameStarted) ? (
            <GameBoard
              chars={this.state.chars}
              gameRef={this.state.gameRef}
              playerName={this.state.playerName}
              players={this.state.players}
              gameOver={this.gameOver} />
          ) : (this.state.gameExists) ? (
            <WaitingRoom
              gameId={this.state.gameId}
              isCreator={this.state.playerIsGameCreator}
              startGame={this.startGame}
              players={this.state.players}/>
          ) : (this.state.gameOver) ? (
            <GameOver
              players={this.state.players}
              playerScores={this.state.playerScores}/>
          ) : (
            <h1>Loading</h1>
          )}
        </Container>
      </React.Fragment>
    );
  }
}