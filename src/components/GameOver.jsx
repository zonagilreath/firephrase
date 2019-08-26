import React from 'react';

export default function SubmittedWordsList(props){
  const players = props.players.slice();
  players.sort((a, b)=> props.playerScores[b] - props.playerScores[a])
  return (
    <React.Fragment>
      <h1>Game Over</h1>
      <ol>
        {players.map((player, idx) => (
          <li key={'player_' + (idx)}>{`${player}: ${props.playerScores[player]}`}</li>
        ))}
      </ol>
      <button type='button' onClick={() => {
        location = 'http://' + location.host;
      }}>
        Start a new game
      </button>
    </React.Fragment>
  )
}