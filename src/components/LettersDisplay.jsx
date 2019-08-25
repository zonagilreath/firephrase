import React from 'react';

export default function LettersDisplay(props){
  return (
    <h1>{props.unusedChars.join(', ')}</h1>
  )
}