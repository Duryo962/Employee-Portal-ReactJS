// Loader.jsx
import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    backdropFilter: 'blur(3px)',
  },
  loader: {
    animation: '$rotation 1s linear infinite',
  },
  '@keyframes rotation': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
}));

const Loader = () => {
  const classes = useStyles();

  return (
            <Backdrop className={classes.backdrop} open={true}>
                    <CircularProgress className={classes.loader}  color="inherit" />
            </Backdrop>
  );
};

export default Loader;
