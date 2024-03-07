import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, Card, CardContent, Checkbox, Fab, FormControlLabel, FormGroup, Grid } from '@mui/material';
import './login.css';
import axios, { Axios } from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
export const Login = () => {
     const navigate = useNavigate();

    const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
// duryodan api
        // http://10.0.0.94:8080/api/user/FetchByUserId/{userId}
      const response = await axios.get(`http://10.0.0.94:8080/api/user/FetchByUserId/${loginId}`);
  
      const userData = response.data;
  console.log(response);
      // Check if the password matches
      if (userData.password === password) {
        // Login successful, you can perform further actions here
        console.log('Login successful');
         navigate('/this');
    } else {
        // Incorrect password
        console.log('Incorrect password');
      }
    } catch (error) {
      // Handle API call error
      console.error('Error fetching user data:', error);
    }
  };
  
   
  return (
    <Box sx={{  background: "radial-gradient(gray, black)" ,height: "100vh"}}>
    
        <Grid style={{background: "rgb(151,151,153",borderRadius:"15px"}}className='custom-card'>
            <form onSubmit={handleSubmit}>
              <h2 className='custom-h2'>  Sign-in</h2>
              <Grid>
             <div>
                <TextField  
                color='success' id="standard-basic" 
                label="Login-id" variant="outlined" 
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                />
             </div>
             <br/>
             <div>             
                <TextField  
                color='success' id="standard-basic"  
                 label="Password" variant="outlined" 
                 type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                 />
                </div>
              <div>
              </div>
              </Grid>
              <br/>
              <Fab variant="extended" type='submit' color='success'>
               
                Login &nbsp;
                <LoginIcon sx={{ mr: 1 }} />
                </Fab>
                {/* <Button type='submit' variant="contained" color='success'>Login</Button> */}
              
                <p>
                  Don't have an account..?&nbsp;&nbsp;
                  <a href='#' className='signUpBtn-link' style={{color:"#2E7D32",fontWeight:"bold",textDecoration:"none"}}>Sign Up</a>
                </p>
              
            </form>
        </Grid>
    </Box>
  );
};
