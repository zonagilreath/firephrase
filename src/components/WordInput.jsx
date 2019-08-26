import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

export default function WordInput(props){
  return (
    <form onSubmit={props.submitWord}>
      <FormControl>
        <TextField
          id="wordInput"
          label="Create a word from the letters"
          onChange={props.inputChangeHandler}
          margin="normal"
          variant="outlined"/>
      </FormControl>
    </form>
  )
}