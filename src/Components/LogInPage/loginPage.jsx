import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { Avatar, Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { getPasswordById, sendMailVerificationCode, updatePassword } from '../../ProfileApiCalls/LoginPage/LoginApiCalls';
import backgroundImage from '../Images/LoginBackgroundImage.jpg';
import { useUserContext } from '../UserIdStore/UserContext';
import { Link ,useNavigate } from 'react-router-dom';
import { getEmailId } from '../../ProfileApiCalls/profile/Apicalls';
import SendIcon from '@mui/icons-material/Send';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ForwardIcon from '@mui/icons-material/Forward';
import Loader from '../Loader/Loader';


function LoginPage() {
    
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [apiPassword, updateApiPassword] = useState('');
  const [forgotPassword, updateForgotPassword] = useState('');
  const [confirmPassword, updateConfirmPassword] = useState('');
  const [display, updateDisplay] = useState(false);
  const [randomNumber, updateRandomNumber] = useState('');
  const [generateRandom,UpdateGeneraterandom]=useState('');
  const [displayRandom, updateDisplayRandom] = useState(false); 
  const { setUserId } = useUserContext();
  const [forgot, updateForgot] = useState(false);
  const navigate = useNavigate();
  const [displayTimer,UpdateDisplayTimer]=useState(false)
  const [countdown, setCountdown] = useState(300);
  const [timerActive, setTimerActive] = useState(false);
  const [loading,updatLoading]=useState(false);
  const [resendCode,UpdateResendCode]=useState(false);
        // Declare userid and password variables
  const [userDetails, updateUserDetails] = useState({
    userId: '',
    password: '',
  });

        // Set Timer Code
  useEffect(() => {
    let interval;
    if (timerActive) 
    {
      interval = setInterval(() => {
        setCountdown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

        // Start Timer code
  const startTimer = () => {
    setTimerActive(true);
  };

  useEffect(() => {
    if (countdown === 0)
    {
      setTimerActive(false);
      UpdateDisplayTimer(false);
      UpdateResendCode(true)
      UpdateGeneraterandom('')
      alert("Code has expired.");
    }
  }, [countdown]);
        
        // Display Passwords Code
  const handleTogglePasswordVisibility = (field) => {
    switch (field)
    {
      case 'password':setShowPassword((prev) => !prev);
      break;
      case 'forgotPassword':setShowPassword1((prev) => !prev);
      break;
      case 'confirmPassword':setShowPassword2((prev) => !prev);
      break;
      default:
      break;
    }
  };

        // Hide Passwords Code
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {}, [apiPassword]);

        // Fetching User Details Code
  const fetchUserDetails = async (empId) => {
    if(empId)
    {
      try 
        {
          const userDetailsApiRes = await getPasswordById(empId);
          updateApiPassword(userDetailsApiRes.data.password);
          setUserId(empId);
          localStorage.setItem('userId', empId);
        } 
      catch (e)
        {
          console.log('Error fetching User Details based on user id:', e);
        }
    }
  };

  useEffect(() => {}, [userDetails]);
        
        // Login button onclick  Function 
  const loginFunction = () => {
    fetchUserDetails();
    if (userDetails.userId || apiPassword) 
    {
      if (userDetails.password === apiPassword) 
          {
            const confirmation = window.confirm('Are you sure you want to log in?');
              if (confirmation) 
              {
                localStorage.setItem('userId', userDetails.userId);
                navigate('/profile', { replace: true });
              } 
          } 
        else 
          {
            alert('Invalid Credintials');
          }
      } 
    else
      {
      alert('Please Enter userID and password');
      }
  };

  const resetTimer = () => {
    setCountdown(180); 
    setTimerActive(true);
    UpdateDisplayTimer(true);
    UpdateResendCode(false); 
  };

        // Send code button onclick function
  const sentEmailCode = async () => {
    if (userDetails.userId) 
      {
        const email=await getEmailId(userDetails.userId);
        if(email.data !=='')
          {
            updatLoading(true)
            const newRandomNumber = Math.floor(Math.random() * 1000000000) + 1;
            UpdateGeneraterandom(newRandomNumber)
            const result=await sendMailVerificationCode(userDetails.userId,email.data,newRandomNumber);
            updateRandomNumber('')
            updatLoading(false);
            UpdateDisplayTimer(true);
            startTimer ();
            updateDisplayRandom(true);
            alert("Verification code has been successfully sent to the email address")
          }
        else
          {
            updatLoading(false);
            alert("Email ID is not present for this Employee ID please check and try again.")
          }
      } 
    else
      {
          alert("Please Enter UserID");
      }
  };

        // Verify Button Onclick Function
  const validateCode = () => {
    if(parseInt(generateRandom, 10) === parseInt(randomNumber, 10))
      {
        updateDisplayRandom(false);
        updateDisplay(true);
        UpdateDisplayTimer(false)
      }
    else
      {
        alert("Entered verification code for email sending does not match")
      }
          
  };

        // Confirm Button OnClick Function
  const UpdatePassword=async()=>{
    if(forgotPassword===confirmPassword)
      {
        updatLoading(true)
        const updatePasswordRes=await updatePassword(userDetails.userId,confirmPassword);
        console.log(updatePasswordRes);
        updateDisplay(false);
        updateDisplayRandom(false);
        updateUserDetails((user)=>({...user, userId:'',password:''}))
        updatLoading(false);
        alert("Password Updated Successfully")
      }
    else
      {
        alert("Password mismatch")
      }
  }
  const body=(
      
      <>
        {/* Login Page */}
        <Box sx={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', }} >
          <Grid style={{ backgroundColor: 'transparent', border: '1px solid #fff', borderRadius: '10px', width: '350px', height: '400px', }} className="custom-card" >
            <div>
                {forgot ? (
              <>
                <h2 className="custom-h2" style={{ color: 'white' ,fontFamily:'emoji'}}> Forgot Password </h2>
                <Grid>
                  {/* Employee ID Field */}
                  <div>
                  <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <TextField id="standard-basic" label="Employee ID" variant="outlined"
                      sx={{
                        '--TextField-brandBorderColor': '#FFFF',
                        '--TextField-brandBorderHoverColor': '#FFFF',
                        '& input': {
                                     color: 'white',
                                   },
                        '& label': {
                                     color: 'white',
                                    },
                        '& label.Mui-focused':{
                                                color: 'white',
                                              },
                        '& fieldset': {
                                        borderColor: 'var(--TextField-brandBorderColor)',
                                      },
                      }}
                      value={userDetails.userId}
                      onChange={(e) => {
                      const newUserId = e.target.value;
                      updateUserDetails((userid) => ({ ...userid, userId: newUserId }));
                            }}
                    />
                  </FormControl>
                </div>
                                    
                {/* Email Code Field */}
                {displayRandom && (
                <>
                  <div>
                      <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <TextField id="standard-basic" label="Email Code"variant="outlined"
                          sx={{
                            '--TextField-brandBorderColor': '#FFFF',
                            '--TextField-brandBorderHoverColor': '#FFFF',
                            '& input':{
                                        color: 'white',
                                      },
                            '& label':{
                                        color: 'white',
                                      },
                            '& label.Mui-focused':{
                                                    color: 'white',
                                                  },
                            '& fieldset':{
                                          borderColor: 'var(--TextField-brandBorderColor)',
                                         },
                          }}
                          value={randomNumber}
                          onChange={(e) => {
                            const randomNumber = e.target.value;
                            updateRandomNumber(randomNumber);
                          }}
                        />
                      </FormControl>
                  </div>
                </>
                )}
                                    
                {/* Display Timer */}
                {displayTimer &&
                  <div style={{ color: 'white', marginTop: '5px' }}>
                    Time remaining: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                  </div>
                }

                {resendCode &&  
                <div>
                  <Link 
                    style={{ 
                    color: 'white',
                    position: 'relative', 
                    marginRight: '100px', 
                    textDecoration: 'none' ,

                    }}

                    onClick={() => {
                      resetTimer();
                      sentEmailCode();
                    }}
                  >
                    <Button type='text' 
                     style={{color:"#FFFF",textTransform:'none'}}>
                     <SendIcon  style={{color:"#FFFF",fontSize:"20px"}}/>Resend code</Button>
                                        
                  </Link>
                </div>}
                                    
                {/*  Display Password and confirm password fields */}
                {display ? (
                <>
                {/* Password Field */}
                <div>
                  <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password" style={{ color: 'white' }}> Password </InputLabel>
                    <OutlinedInput id="outlined-adornment-password1" type={showPassword1 ? 'text' : 'password'}
                      sx={{
                        '--TextField-brandBorderColor': '#FFFF',
                        '--TextField-brandBorderHoverColor': '#FFFF',
                        '& fieldset':{
                                      borderColor: 'var(--TextField-brandBorderColor)',
                                    },
                      }}
                      style={{ color: '#FFF' }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => handleTogglePasswordVisibility('forgotPassword')}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword1 ?  <Visibility style={{ color: '#FFFF' }} /> : <VisibilityOff style={{ color: '#FFFF' }} />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                      value={forgotPassword}
                      onChange={(e) => {
                        const password1 = e.target.value;
                        updateForgotPassword(password1);
                      }}
                    />
                  </FormControl>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password" style={{ color: 'white' }}> Confirm Password</InputLabel>
                    <OutlinedInput id="outlined-adornment-password" type={showPassword2 ? 'text' : 'password'}
                      sx={{
                        '--TextField-brandBorderColor': '#FFFF',
                        '--TextField-brandBorderHoverColor': '#FFFF',
                        '& fieldset':{
                                      borderColor: 'var(--TextField-brandBorderColor)',
                                    },
                      }}
                      style={{ color: '#FFF' }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => handleTogglePasswordVisibility('confirmPassword')}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword2 ? <Visibility style={{ color: '#FFFF' }} />  :  <VisibilityOff style={{ color: '#FFFF' }} />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label=" Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => {
                        const confirmPass = e.target.value;
                        updateConfirmPassword(confirmPass);
                      }}
                    />
                  </FormControl>
                </div>
              </>
              ) : (
              <>
              {/* Additional content for display being false */}
              </>
              )}


              {/* Back To Login Button Link */}
              <div>
                <Link 
                  style={{
                    color: 'white', 
                    position: 'relative', 
                    marginRight: '100px', 
                    textDecoration: 'none' 
                  }}
                  onClick={() => {
                    updateForgot((currentState) => !currentState);
                    updateConfirmPassword('');
                    updateForgotPassword('');
                    updateUserDetails((user) => ({ ...user, userId: '' }));
                    updateDisplay(false);
                    updateDisplayRandom(false);
                    setTimerActive(false);
                    UpdateDisplayTimer(false)
                  }}
                >
                  <Button type='text' style={{color:"#FFFF",textTransform:'none'}}><ArrowCircleLeftIcon  style={{color:"#FFFF",fontSize:"20px"}}/> Back to LogIn</Button>
                </Link>
              </div>
          </Grid>
          <br />
            <div>
              {display ? (
              // Confirm Button
              <>
                <Button 
                  style={{ 
                    color: 'white', 
                    backgroundColor: '#33B249' 
                  }} variant="contained"
                   onClick={UpdatePassword}
                >Confirm</Button>
              </>
              ) : (
              <>
              {displayRandom ? (
              // Verify Button
              <>
                <Button
                  style={{ 
                    color: 'white', 
                    backgroundColor: '#33B249',  
                    alignItems: 'center', 
                    textTransform:'none'
                  }}
                  variant="contained"
                  onClick={validateCode} >
                  Verify &nbsp;
                  <ForwardIcon  style={{color:"#FFFF",fontSize:"20px"}}/>
                </Button>
              </>
              ) : (
                 //  Send Code Button
              <>
                <Button 
                  style={{ 
                   color: 'white', 
                   backgroundColor: '#33B249' , 
                   alignItems: 'center', 
                   textTransform:'none'
                  }} 
                  variant="contained"
                  onClick={sentEmailCode}>
                   Send Code &nbsp;
                  <SendIcon style={{color:"#FFFF",fontSize:"20px"}}/>
               </Button>
             </>
             )}
            </>
             )}
            </div>
            </>
            ): (
            <>
              <h2 className="custom-h2" style={{ color: 'white',fontFamily:'emoji' }}> Sign In</h2>
              
              <Grid>
                {/* Employee Id Field */}
                <div>
                  <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <TextField  id="standard-basic"label="Employee ID"variant="outlined"
                      sx={{
                        '--TextField-brandBorderColor': '#FFFF',
                        '--TextField-brandBorderHoverColor': '#FFFF',
                        '& input':{
                                    color: 'white',
                                  },
                        '& label':{
                                    color: 'white',
                                  },
                        '& label.Mui-focused':{
                                               color: 'white',
                                              },
                        '& fieldset':{
                                      borderColor: 'var(--TextField-brandBorderColor)',
                                     },
                      }}
                      value={userDetails.userId}
                      onChange={(e) => {
                        const newUserId = e.target.value;
                        updateUserDetails((userid) => ({ ...userid, userId: newUserId }));
                      }}
                    />
                  </FormControl>
                </div>
                <br />
                                    
                {/* Password Field */}
                <div>
                  <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password" style={{ color: 'white' }}> Password </InputLabel>
                    <OutlinedInput id="outlined-adornment-password" type={showPassword ? 'text' : 'password'}
                      sx={{
                        '--TextField-brandBorderColor': '#FFFF',
                        '--TextField-brandBorderHoverColor': '#FFFF',
                        '& fieldset': {
                                         borderColor: 'var(--TextField-brandBorderColor)',
                                      },
                      }}
                      style={{ color: '#FFF' }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => handleTogglePasswordVisibility('password')}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ?  <Visibility style={{ color: '#FFFF' }} /> : <VisibilityOff style={{ color: '#FFFF' }} />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                      value={userDetails.password}
                      onChange={(e) => {
                        const password = e.target.value;
                        updateUserDetails((userid) => ({ ...userid, password: password }));
                      }}
                      onMouseEnter={() => fetchUserDetails(userDetails.userId)} 
                    />
                  </FormControl>
                </div>

                {/* Forgot Password Link */}
                <div>
                  <Link
                    style={{ 
                      color: 'white', 
                      position: 'relative', 
                      marginRight: '104px', 
                      textDecoration: 'none' 
                    }}
                    onClick={() => {
                      updateForgot((currentState) => !currentState);
                      updateUserDetails((user) => ({ ...user, password: '', userId: '' }));
                      setTimerActive(false);
                      UpdateDisplayTimer(false);
                    }}
                  >
                    Forgot Password
                  </Link>
                </div>
              </Grid>
              <br />

              {/* Login Button */}
              <div>
                <Button
                  style={{ color: 'white', backgroundColor: '#33B249' ,textTransform:'none'}}
                  variant="contained"
                  onClick={loginFunction}
                >
                  Log In <LoginIcon sx={{ mr: 1 }} />
                </Button>
              </div>
            </>
            )}
            </div>
          </Grid>
        </Box>
      </>
  )

  return (
          <div>
              {loading ? (
                <>
                  <Loader />
                  <div >
                    {body}
                  </div> 
                </>
              ) : (
                        
                  <div>
                    {body}
                  </div>
              )               
              }
          </div>   
  );
}

export default LoginPage;
