import React, {useState} from 'react';

export default function CreateGame(props){
  const [playerName, setName] = useState('');
  return (
    <form onSubmit={e => {
      e.preventDefault();
      props.createGame(playerName)
    }}>
      <h1>Start a new game</h1>
      <input
        placeholder='Pick a username'
        type='text'
        onChange={(e)=> setName(e.target.value)} />
    </form>
  )
}