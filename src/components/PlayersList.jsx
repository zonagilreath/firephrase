import React from 'react';

export default function PlayersList(props){
  return (
  <ul>
  {props.players.map((player, idx) => (
    <li key={'player_' + (idx + 1)}>{props.playerScores ? `${player}: ${props.playerScores[player]}` : player}</li>
  ))}
  </ul>
  )
}