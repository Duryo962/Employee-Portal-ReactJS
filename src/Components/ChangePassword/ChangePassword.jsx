import { Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, useMediaQuery } from '@mui/material';
import Loader from '../Loader/Loader';
import { useEffect, useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { updatePassword } from '../../ProfileApiCalls/LoginPage/LoginApiCalls';
import { DangerColor, SuccessColor, ThemeColor } from '../ENV Values/envValues';
import { HeadingsStyles } from '../Styles/Styles';
import TimerComponent from '../TimeOutComponent/TimeOut';
import NotificationComponent from '../Notification/NotificationComponent';
import LockResetIcon from '@mui/icons-material/LockReset';
function ChangePassword() {
  const [userId,setuserId ] =useState('')
  const [loading, updateLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassworddisplay,setConfirmPassworddisplay]=useState(false);
  const [confirmPassword,setConfirmPassword]=useState('')
  const [password,setPassword]=useState('');
  const [error, setError] = useState('');
  const isMobileOrMediumScreen = useMediaQuery((theme) => theme.breakpoints.down('sm') || theme.breakpoints.down('md') || theme.breakpoints.down('xs'));
  const handleTogglePasswordVisibility = (field) => {
    switch (field) {
      case 'password': 
        setShowPassword((prev) => !prev);
        break;
     case 'ConfirmPassword':
        setConfirmPassworddisplay((prev) => !prev);
        break;
      default:
        break;
    }
  };
  const [notificationData,setNotificationData]=useState({
    color:'',
    message:'',
    visibility:false,
  })

//   Password Display
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
    // Using useEffect to log the error after state update
  useEffect(() => {
  }, [error]);

    useEffect(() => {
        const userId=localStorage.getItem('userId');
        setuserId(userId);
    }, []);

    // Validation Function
    function validation() {
        var isValid = true;

        if (!password || !confirmPassword) {
            setError("Please enter both password and confirm password");
            alert('Please enter both password and confirm password')
            isValid = false;
        } else {
            setError('');
        }

        if (password !== confirmPassword) {
            setError("Password and confirm password do not match");
            alert("Password and confirm password do not match");
            isValid = false;
        } else {
            setError('');
        }
        return isValid;
    }

        //  Change Password Function
  const changePasswordInDB=async()=>{
    const ValidationRes=validation();
    if(ValidationRes=== true)
    {
        try{
            updateLoading(true);
            const res=await updatePassword(userId,confirmPassword);
            if (res && res.Status === "OK") {
                setPassword('');
                setConfirmPassword('')
                updateLoading(false)
                setNotificationData((pre)=>({
                    ...pre,
                    color:SuccessColor,
                    message:res.Message,
                    visibility:true,
                }))
            }
            else{
                updateLoading(false);
                setNotificationData((pre)=>({
                    ...pre,
                    color:DangerColor,
                    message:res.Message,
                    visibility:true,
                }))
            }
        }
        catch(e)
        {
            updateLoading(false);
            setNotificationData((pre)=>({
                ...pre,
                color:DangerColor,
                message:"Unable to update password. Please try again.",
                visibility:true,
            }))
        }
    }
  }
  
  // You need to define the 'body' variable or replace it with the actual content you want to render
 const body=(
    <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start',overflow:"auto", height: '90vh' }}>
    <Grid container spacing={0.8} style={{ flex: 1 }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Grid container spacing={0.8}>

                {/* Heading */}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <div>
                    <h1 style={HeadingsStyles}>Change Password</h1>
                  </div>
                </Grid>

                {/* Horizontal Line Grid */}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <hr style={{ background: ThemeColor.Color , color:ThemeColor.Color , borderColor: ThemeColor.Color , height: '3px', maxWidth: "100%", width: "90%" }}></hr>
                </Grid>

                {/* Passwod Field */}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password" >  Password</InputLabel>
                            <OutlinedInput id="outlined-adornment-password" type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => handleTogglePasswordVisibility('password')}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <Visibility  />  :  <VisibilityOff  />}
                                    </IconButton>
                                </InputAdornment>
                                }
                                label=" Password"
                                value={password}
                                onChange={(e) => {
                                    const passwrd = e.target.value;
                                    setPassword(passwrd);
                                }}
                            />
                        </FormControl>
                    </div>    
                </Grid>

                {/* Confirm Password Field */}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password" > Confirm Password</InputLabel>
                            <OutlinedInput id="outlined-adornment-password1" type={confirmPassworddisplay ? 'text' : 'password'}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => handleTogglePasswordVisibility('ConfirmPassword')}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {confirmPassworddisplay ? <Visibility  />  :  <VisibilityOff  />}
                                    </IconButton>
                                </InputAdornment>
                                }
                                label="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    const passwrd = e.target.value;
                                    setConfirmPassword(passwrd);
                                }}
                            />
                        </FormControl>
                    </div>    
                </Grid>

                {/* Error message display */}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    {error && (
                        <div style={{ color: 'red', marginTop: '10px' }}>
                            {error}
                        </div>
                    )}
                </Grid>

                {/* Change Password Button */}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div>
                       <Button variant='contained' size='medium' style={{backgroundColor:ThemeColor.Color,textTransform:'none' }} onClick={changePasswordInDB} endIcon={<LockResetIcon/>}> Change Password</Button>
                    </div>    
                </Grid>
                <NotificationComponent backgroundColor={notificationData.color} message={notificationData.message} onClose={()=>{setNotificationData((pre)=>({...pre,visibility:false}))}} open={notificationData.visibility}/>
                <TimerComponent/>
            </Grid>
        </Grid>
    </Grid>
</div>
 )
  return (
        <div>
            {loading && <Loader />}
            {isMobileOrMediumScreen ? (
                <div style={{ backgroundColor: '#FFFFFF', padding: '0px', position: 'relative', top: '8vh' }}>
                    {body}
                </div>
            ) : (
                <div style={{ backgroundColor: '#FFFFFF', padding: '0px', position: 'relative', top: '8vh', marginLeft: '35vh' }}>
                    {body}
                </div>
            )}
        </div>
        
  );
}

export default ChangePassword; // Corrected the export name
