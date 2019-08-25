import React, {useState} from 'react';

export default function JoinGame(props){
  const [playerName, setName] = useState('');
  return (
    <form onSubmit={e => {
      e.preventDefault();
      props.playerJoin(playerName)
    }}>
      <h1>Choose a username</h1>
      <input type='text' onChange={(e)=> setName(e.target.value)} />
    </form>
  )
}