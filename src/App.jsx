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
      players: [],
      chars: '',
      submittedWords: [],
    }
  }

  componentDidMount(){
    this.getChars()
    this.db.collection('games').doc(this.state.gameId)
    .onSnapshot(doc => {
      const players = doc.data().players;
      const submittedWords = doc.data().submittedWords;
      this.setState({players, submittedWords})
    })
  }

  getChars(){
    const gameRef = this.db.collection('games').doc(this.state.gameId);
    const chars = generateCharSet();
    gameRef.update({chars})
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
        <SubmittedWordsList words={this.state.submittedWords} />
        <GameBoard
          chars={this.state.chars}
          gameRef={this.db.collection('games').doc(this.state.gameId)}/>
      </React.Fragment>
    )
  }
}