import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export default function SubmittedWordsList(props){
  const players = props.players.slice();
  players.sort((a, b)=> props.playerScores[b] - props.playerScores[a])
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center">
      <Typography variant="h4" component="h3">
        Game Over!
      </Typography>
      <List>
        {players.map((player, idx) => (
          <ListItem key={'player_' + (idx)}>
          <Chip
            icon={<FaceIcon />}
            label={`${player}: ${props.playerScores[player]}`}/>
          </ListItem>
        ))}
      </List>
      <Button type='button' onClick={() => {
        location = 'http://' + location.host;
      }}>
        Start a new game
      </Button>
    </Grid>
  )
}