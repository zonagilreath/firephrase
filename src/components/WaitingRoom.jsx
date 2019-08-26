import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PlayersList from './PlayersList.jsx';

const useStyles = makeStyles({
  card: {
    minWidth: 275,
    paddingBottom: 50
  },
  row: {
    textAlign: 'center',
  },
});

export default function WaitingRoom(props){
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <Grid
        container
        justify="center"
        alignItems="center">
        <CardContent>
          <Grid item xs={12} className={classes.row}>
            <Typography variant="h4" component="h3">
              {props.isCreator ?
                'Start the game whenever you\'re ready' :
                `Waiting for ${props.players[0]} to start the game...`}
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.row}>
            <PlayersList players={props.players}/>
          </Grid>
        </CardContent>
      {props.isCreator ? (
        <Grid item xs={12} className={classes.row}>
          <Typography variant="h5" component="h4">
            Share this link with your friends
          </Typography>
          <TextField
            defaultValue={window.location.href + props.gameId}
            margin="normal"
            style ={{width: '40%', textAlign: 'center'}}
            InputProps={{
              readOnly: true,
            }}/>
          <br />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={props.startGame}
            className={classes.button}>
            Start game
          </Button>
        </Grid>
      ) : (null)}
      </Grid>
    </Card>
  )
}