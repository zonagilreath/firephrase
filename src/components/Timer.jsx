import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles({
  root: {
    minHeight: 20,
    width: '40%',
    flexGrow: 1,
  },
});

export default function Timer(props){
  const classes = useStyles();
  const [time, setTime] = React.useState(100);

  React.useEffect(() => {
    function progress() {
      setTime(oldTime => {
        if (oldTime === 0) {
          return 0;
        }
        return oldTime - 0.1;
      });
    }

    const timer = setInterval(progress, 150);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.root}>
      <LinearProgress variant="determinate" value={time} />
    </div>
  );
}