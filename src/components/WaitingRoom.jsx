import React from 'react';
import PlayersList from './PlayersList.jsx'

export default function WaitingRoom(props){
  return (
    <React.Fragment>
      <h1>
        {props.isCreator ?
          'Start the game whenever you\'re ready' :
          `Waiting for ${props.players[0]} to start the game...`}
      </h1>
      <PlayersList players={props.players}/>
      {props.isCreator ? (
        <React.Fragment>
          <h2>Share this link with your friends</h2>
          <h1>{window.location.href + props.gameId}</h1>
          <button type='button' onClick={props.startGame}>Start Game</button>
        </React.Fragment>
      ) : (null)}
    </React.Fragment>
  )
}