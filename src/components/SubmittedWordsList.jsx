import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles(theme => ({
  root: {
    width: '40%',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  }
}));

export default function SubmittedWordsList(props){
  const classes = useStyles();
  return (
    <Grid className={classes.root}>
      {props.words.map((word, idx) => (
        <Chip label={word} key={'word_' + (idx)}/>
      ))}
    </Grid>
  )
}