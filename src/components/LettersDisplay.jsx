import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

export default function LettersDisplay(props){
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center">
      {props.unusedChars.map((char, idx) => (
        <Card key={'letter_' + (idx)}>
          <CardContent>
            <Typography variant="h4" component="h3">
              {char}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Grid>
  )
}