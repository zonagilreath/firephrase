import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  card: {
    minWidth: 275,
    paddingBottom: 50
  },
  row: {
    textAlign: 'center',
  },
});

export default function CreateGame(props){
  const classes = useStyles();
  const [playerName, setName] = useState('');
  return (
    <Card className={classes.card}>
      <Grid
        container
        justify="center"
        alignItems="center">
        <Grid item xs={12} className={classes.row}>
          <CardContent>
            <Typography variant="h4" component="h3">
              Create a new game
            </Typography>
          </CardContent>
        </Grid>
        <Grid item xs={12} className={classes.row}>
          <form onSubmit={e => {
            e.preventDefault();
            props.createGame(playerName)
          }}>
            <FormControl>
              <TextField
                label="Pick a username"
                className={classes.textField}
                onChange={(e)=> setName(e.target.value)}
                margin="normal"
                variant="outlined"/>
            </FormControl>
            <br />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}>
              Create game
            </Button>
          </form>
        </Grid>
      </Grid>
    </Card>
  )
}