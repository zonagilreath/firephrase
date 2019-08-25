import React from 'react';

export default function SubmittedWordsList(props){
    return (
    <ul>
    {props.words.map((word, idx) => (
      <li key={'word_' + (idx + 1)}>{word}</li>
    ))}
    </ul>
  )
}