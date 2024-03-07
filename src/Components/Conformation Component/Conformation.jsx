import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { ThemeColor, cancelButtonColor } from '../ENV Values/envValues';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
function Confirmation({ open, onClose, onAction, data }) {

    const handleAction = (action) => {
        onClose();
        onAction(action); // Pass the result back to the parent component
    };

    return (
        <Dialog fullWidth={true} maxWidth={'sm'} open={open} onClose={onClose}>
            <DialogTitle style={{ backgroundColor: ThemeColor.Color, color: '#fff' ,fontWeight:'bolder',fontFamily:'emoji'}}>
                <Box display="flex" justifyContent="center" >
                    Confirmation
                    <IconButton onClick={onClose} style={{ position: 'absolute', right: '8px', top: '8px', color: '#fff' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText style={{fontWeight:'bolder',color:'#000000'}}>Check Details</DialogContentText>
                <Box noValidate component="form" sx={{ display: 'flex', flexDirection: 'column', m: 'auto' }}>
                    <FormControl sx={{ mt: 2, minWidth: 200 }}>
                        <Typography variant="body1" gutterBottom>
                            {data.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </Typography>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Box display="flex" justifyContent="center" sx={{ width: '100%' }}>
                    <ButtonGroup variant="contained" sx={{ gap: '30px' }}>
                        <Button onClick={() => handleAction('ok')} endIcon={<DoneIcon/>} style={{ backgroundColor: ThemeColor.Color, color: '#fff' ,textTransform:'none'}}>
                            Ok
                        </Button>
                        <Button onClick={() => handleAction('cancel')} endIcon={<CloseIcon/>} style={{ backgroundColor: cancelButtonColor, color: '#fff',textTransform:'none' }}>
                            Close
                        </Button>
                    </ButtonGroup>
                </Box>
            </DialogActions>
        </Dialog>
    );
}

export default Confirmation;
