import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ClickAwayListener from '@mui/material/ClickAwayListener';


function NotificationComponent({ message, open, onClose, backgroundColor }) {
    return (
        <ClickAwayListener onClickAway={onClose} >
            <Snackbar 
                open={open} 
                autoHideDuration={4000} 
                onClose={onClose} 
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
                sx={{ marginTop: '49px' }}
            >
                <MuiAlert 
                    onClose={onClose} 
                    
                    sx={{ width: '100%', backgroundColor:backgroundColor,color:'#FFFF' }} 
                    action={
                        <IconButton size="small" aria-label="close" color="inherit" onClick={onClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    {message}
                </MuiAlert>
            </Snackbar>
        </ClickAwayListener>
    );
}

export default NotificationComponent;
