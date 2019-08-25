import React from 'react';

export default function WordInput(props){
  return (
    <form onSubmit={props.submitWord}>
      <input id='wordInput' type='text' onChange={props.inputChangeHandler} />
    </form>
  )
}