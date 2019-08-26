import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';

export default function PlayersList(props){
  return (
    <Grid
      container
      justify="center"
      alignItems="center">
      <List>
        {props.players.map((player, idx) => (
          <ListItem key={'player_' + (idx)}>
          <Chip
            icon={<FaceIcon />}
            label={props.playerScores ? `${player}: ${props.playerScores[player]}` : player}/>
          </ListItem>
        ))}
      </List>
    </Grid>
  )
}