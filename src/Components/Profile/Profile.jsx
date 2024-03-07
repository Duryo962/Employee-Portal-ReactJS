import React, { useEffect, useState } from 'react';
import { Grid, Button, Dialog, DialogTitle, DialogContent, DialogContentText, Box, FormControl,  DialogActions, TextField, Card, CardContent, Typography, ButtonGroup, useMediaQuery} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import CallIcon from '@mui/icons-material/Call';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { UpdateAbout, UpdateImageUrl,  getProfileById } from  '../../ProfileApiCalls/profile/Apicalls';
import Loader from '../Loader/Loader';
import TimerComponent from '../TimeOutComponent/TimeOut';
import { DangerColor, SuccessColor, ThemeColor } from '../ENV Values/envValues';
import Conformation from '../Conformation Component/Conformation';
import NotificationComponent from '../Notification/NotificationComponent';
import UpdateIcon from '@mui/icons-material/Update';
import CloseIcon from '@mui/icons-material/Close';
function Profile() {
    const [userId,setUserID]=useState('')
    const [loading,updatLoading]=useState(false)
    const isMobileOrMediumScreen = useMediaQuery((theme) => theme.breakpoints.down('sm') || theme.breakpoints.down('md') || theme.breakpoints.down('xs'));
    const [base64Url, setBase64Url] = useState(null);
    const [open, setOpen] = useState(false);
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('sm');
    const [hovered, setHovered] = useState(false); 
    const [ConformationBoxVisibility,setConformationBoxVisibility]=useState(false);
    const [conformationBoxData,setConformationBoxData]=useState('');
    const [operationName,setOperationName]=useState('')
    const [notificationData,setNotificationData]=useState({
        color:'',
        message:'',
        visibility:false,
    })
    const [profileData,UpdateProfileData]=useState({
        imageUrl:'',
        employeeName:'',
        designation:'',
        emailId:'',
        employeeID:'',
        dateOfJoining:'',
        about:'',
        mobileNumber:'',
        reportingManager:'',
        workFrom:'',
        shiftTimes:''
    })

    // fetching user id from local storage and set user id to local variable
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        setUserID(storedUserId);
    }, []);

    // If userid present then fetch current employee details
    useEffect(()=>{
        if(userId)
            {
                fetchData();
            }

    },[userId])

    const handleMouseEnter = () => {
        setHovered(true);
    };
        
    const handleMouseLeave = () => {
        setHovered(false);
    };

    // Implement Fetching Data(Date getting from DB usinj java and update details )
    const fetchData = async () => {
        try 
            {
                updatLoading(true)
                const empDetails = await getProfileById(userId);
                // console.log("Current employee profile data MS API result : ",empDetails)
                if(empDetails.data.themeColor)
                {
                localStorage.setItem('themeColor',empDetails.data.themeColor);
                ThemeColor.Color=empDetails.data.themeColor;
                if (!localStorage.getItem('profileFetched')) {
                    localStorage.setItem('profileFetched', 'true');
                    window.location.reload(); 
                }
                }
                UpdateProfileData(empDetails.data);
                updatLoading(false)
            } 
        catch(error) 
            {
                console.error('Error fetching data:', error);
                updatLoading(false);
            }
    };

        // Update image ImageUrl url 
    useEffect(() => {
        try 
            {
                const base64Encoded = btoa(base64Url);
                const ImageDecodeUrl1 = atob(base64Encoded);
                UpdateProfileData({...profileData, imageUrl:ImageDecodeUrl1})
            } 
        catch (e) 
            {
                console.error('Error handling base64Url:', e);
            }
    }, [base64Url]);
       

        // function for display Popup 
    const handleClickOpen = () => {
        setOpen(true);
    };

        // Function for close popup
    const handleClose = () => {
        setOpen(false);
    };

        //  Generate base64 url for uploaded image and update base64 url 
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type && file.type.startsWith('image/')) 
                {
                    try 
                        {
                            updatLoading(true);
                            const res = await UpdateImageUrl(userId, file);
                            if (res && res.Status === "OK") 
                            {
                                updatLoading(false);
                                setNotificationData((pre)=>({
                                    ...pre,
                                    color:SuccessColor,
                                    message:res.Message,
                                    visibility:true
                                }))
                                fetchData();
                            }
                            else
                            {
                                updatLoading(false);
                                setNotificationData((pre)=>({
                                    ...pre,
                                    color:DangerColor,
                                    message:res.Message,
                                    visibility:true
                                }))

                            }
                        } 
                    catch(e) 
                        {
                            console.log("Error uploading Profile Image ", e);
                            updatLoading(false);
                            setNotificationData((pre)=>({
                                ...pre,
                                color:DangerColor,
                                 message:"Unable to upload image. Please try again.",
                                visibility:true
                            }))
                        }
                    } 
                else 
                    {
                        alert("Please select an image file");
                    }
            }
    };
    
        
    const handleUploadClick = () => {};

        //  Over lap button On the image styling code
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

        // Update About Function
    const UpdateAboutData=async()=>{
        setOperationName("Update About");
        setConformationBoxData('Are you sure you want to update the profile about?')
        setConformationBoxVisibility(true);
    }

    const handleConfirmationAction =async(result) => {
        if(result==='ok')
        {
            if(operationName==='Update About')
             {
                try
                    {
                        updatLoading(true)
                        handleClose();
                        const res=await UpdateAbout(profileData.employeeID,profileData.about);
                        if (res && res.Status === "OK") 
                        {
                            updatLoading(false);
                            setNotificationData((pre)=>({
                                ...pre,
                                color:SuccessColor,
                                message:res.Message,
                                visibility:true,
                            }))
                        }
                        else{
                            updatLoading(false)
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
                        console.log("Error to update About function : ",e);
                        updatLoading(false)
                        setNotificationData((pre)=>({
                            ...pre,
                            color:DangerColor,
                            message:'Unable to update about. Please try again.',
                            visibility:true,
                        }))
                    }

                }
              
        
            }
            else
            {
                handleClose();
            }
    };
     
    const body=(
        <div>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                <Grid container spacing={1.5}>

                    {/* Employee Information text Grid */}
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <div style={{padding:"0px"}}>
                        <h2  style={{ color: ThemeColor.Color ,fontFamily:'emoji',fontSize: '2em', fontWeight: "30px", maxWidth: "600px", width: "90%", textAlign: "left", position: "relative", margin: "0 auto" }}>Employee Information</h2>
                        </div>  
                    </Grid>

                    {/* Horizontal Line Grid */}
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <hr style={{ background: ThemeColor.Color , color: ThemeColor.Color , borderColor: ThemeColor.Color , height: '3px', maxWidth: "100%", width: "90%" }}></hr>
                    </Grid>

                    {/* Image Display Grid */}
                    <Grid item xs={12} sm={12} md={12} lg={3} xl={3} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        {profileData.imageUrl ? (
                            <div style={{ position: 'relative' }}>
                            {/* Display the selected image */}
                                <img  src={profileData.imageUrl} alt="Selected" style={{ width: 140, height: 140, borderRadius: '50%' ,border: `3px solid ${ThemeColor.Color}`,}} />

                            {/* Upload button overlay */}
                            {hovered && (
                                <button onClick={handleUploadClick} style={{ position: 'absolute', top: '70%', left: '50%',transform: 'translate(-50%, -50%)', padding: '0px', color: '#fff', border: 'none', cursor: 'pointer', opacity: '0.3', }} >
                                    <Button component="label" variant="outlined"  startIcon={<CloudUploadIcon />} > Upload
                                        <VisuallyHiddenInput type="file" onChange={(e) => handleImageChange(e)}/>
                                    </Button>
                                </button>
                                )}
                            </div>
                        ) : (
                        <div style={{ position: 'relative' }} >
                            <AccountCircleIcon sx={{ width: 140, height: 140, color: '#C0C0C0' ,borderRadius: '50%' ,border: `3px solid ${ThemeColor.Color}`,}} />
                            <button style={{ position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)', padding: '0px', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', opacity: '0.3',}} >
                                <Button  component="label" variant="outlined" startIcon={<CloudUploadIcon />}  > Upload <VisuallyHiddenInput type="file" onChange={(e) => handleImageChange(e)} />
                                    </Button>
                            </button>
                        </div>
                        )}
                    </Grid>

                    {/* EmployeeName & Designation Grid */}
                    <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
                        <div style={{  display: 'flex', flexDirection: 'column', margin: '0', padding: '0', position:"relative",}}>
                            <p style={{fontSize: "25px", color: ThemeColor.Color, fontWeight: 'bolder', margin: '0'}}>{profileData.employeeName}</p>
                            <p style={{ margin: '0',color:'#000000',fontWeight:'bold' }}>{profileData.designation}</p>
                        </div>
                    </Grid>

                    {/* Email & Designation Grid */}
                    <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <div style={{ display: 'flex', flexDirection: 'row', margin: '0', padding: '0', position:"relative",justifyItems:"start",alignContent:"start",paddingLeft:"16px"}}>
                            <div style={{  display: 'flex', flexDirection: 'column', margin: '0', padding: '0', top:"20px",direction: 'ltr',right:"50px",gap:"20px",textAlign: "left"}}>        
                                    <div >
                                        <p style={{ margin: '0'}}>Email</p>
                                        <p style={{ margin: '0' }}><b>{profileData.emailId}</b></p>
                                    </div>
                                    <div>
                                        <p style={{ margin: '0' }}>Designation</p>
                                        <p style={{ margin: '0' }}><b>{profileData.designation}</b></p>
                                    </div>
                            </div>      
                        </div>
                    </Grid>

                    {/* Employee ID  & Date Of Joining Grid */}
                    <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    
                        <div style={{ display: 'flex', flexDirection: 'row', margin: '0', padding: '0', position:"relative",justifyItems:"start",alignContent:"start",paddingLeft:"16px"}}>
                            <div style={{  display: 'flex', flexDirection: 'column', margin: '0', padding: '0',direction: 'ltr',gap:"20px",textAlign: "left"}}>        
                                    <div >
                                        <p style={{ margin: '0'}}>Employee ID</p>
                                        <p style={{ margin: '0' }}><b>{profileData.employeeID}</b></p>
                                    </div>
                                    <div>
                                        <p style={{ margin: '0' }}>Date Of Joining</p>
                                        <p style={{ margin: '0' }}><b>{profileData.dateOfJoining}</b></p>
                                    </div>
                            </div>      
                        </div>
                    </Grid>

                    {/* About Grid */}
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <div style={{maxWidth: "500px", width: "90%", textAlign: "left", position: "relative", margin: "0 auto" }}>
                            <p style={{ color: ThemeColor.Color, fontWeight: "bold", fontSize: "17px", margin: 0 }}><b>About</b></p>
                            <p style={{ margin: 0 }}>{profileData.about}  <EditIcon style={{color:ThemeColor.Color}} onClick={handleClickOpen}/></p>
                        </div>
                    </Grid>

                    {/* Horizontal Line Grid */}
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <hr style={{ background: ThemeColor.Color, color: ThemeColor.Color, borderColor:ThemeColor.Color, height: '3px', maxWidth: "100%", width: "90%" }}></hr>
                    </Grid>

                    {/* Update About PopUp Grid */}
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Dialog fullWidth={fullWidth}  maxWidth={maxWidth} open={open}   >
                                <DialogTitle>About</DialogTitle>
                                <DialogContent>
                                  <DialogContentText> Change Your About  </DialogContentText>
                                    <Box noValidate component="form"sx={{ display: 'flex', flexDirection: 'column', m: 'auto', }} >
                                        <FormControl sx={{ mt: 2, minWidth: 200 }}>
                                            <TextField
                                                id="about"
                                                label="About Me"
                                                type="text"
                                                InputLabelProps={{ shrink: true }}
                                                variant="outlined"
                                                value={profileData.about}
                                                onChange={(e)=>{var about=e.target.value;
                                                                    UpdateProfileData((profile=>({...profile, about:about})))
                                                                }
                                                         }
                                            />
                                        </FormControl>
                                    </Box>
                                </DialogContent>
                                    <DialogActions>
                                        <ButtonGroup variant="contained">
                                                <Button  onClick={UpdateAboutData} style={{ marginRight: '20px',backgroundColor:ThemeColor.Color }} endIcon={<UpdateIcon/>} >Update</Button>
                                                <Button  onClick={handleClose} style={{backgroundColor:"#E93445",color:"white"}} endIcon={<CloseIcon/>}>Close</Button>
                                        </ButtonGroup>
                                    </DialogActions>
                        </Dialog>
                    </Grid>

                    {/* Mobile Number Card Grid */}
                    <Grid item xs={12} sm={12} md={4} lg={3} xl={3} >
                        <Card variant="outlined"sx={{ height: 110, width: 220, backgroundColor: ThemeColor.Color,textAlign: "left", position: "relative", margin: "0 auto"   }}>
                            <CardContent>
                                <Typography variant="p" component="div" style={{fontSize:"17px",color:"#FFFF"}}>
                                    <CallIcon/>  Mobile
                                </Typography>
                                <Typography variant="h2" style={{fontSize:"20px",fontWeight:"bold",color:"#FFFF"}}>
                                   {profileData.mobileNumber}
                                </Typography>
                            </CardContent>
                            {/* <CardActions>
                                <Button size="medium" style={{position:"relative",left:"140px",top:"-21px",fontWeight:"bold",color:"#FFFF"}}>Update</Button>
                            </CardActions> */}
                        </Card>
                    </Grid>

                    {/* Reporting Manager Card Grid */}
                    <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                        <Card variant="outlined" sx={{  height: 110, width: 220, backgroundColor: ThemeColor.Color ,textAlign: "left", position: "relative", margin: "0 auto"  }}>
                            <CardContent>
                                <Typography variant="p" component="div" style={{fontSize:"17px",color:"#FFFF"}}>
                                    <PeopleAltIcon/>  Reporting Manager
                                </Typography>
                                <Typography variant="h2" style={{fontSize:"20px",fontWeight:"bold",color:"#FFF"}}>
                                   {profileData.reportingManager ? profileData.reportingManager :''}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Work From Location  Card Grid */}
                    <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                        <Card variant="outlined" sx={{  height: 110, width: 220, backgroundColor: ThemeColor.Color,textAlign: "left", position: "relative", margin: "0 auto"   }}>
                            <CardContent>
                                <Typography variant="p" component="div" style={{fontSize:"17px",color:"#FFFF"}}>
                                    <AddLocationIcon/>  Work From Location
                                </Typography>
                                <Typography variant="h2" style={{fontSize:"20px",fontWeight:"bold",color:"#FFFF"}}>
                                    {profileData.workFrom}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Shift Timings Display Card Grid */}
                    <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                        <Card variant="outlined" sx={{ height: 110, width: 220 , backgroundColor: ThemeColor.Color,textAlign: "left", position: "relative", margin: "0 auto"  }}>
                            <CardContent>
                                <Typography variant="p" component="div" style={{fontSize:"17px", color:"#FFFF"}}>
                                    <MoreTimeIcon/>  Shift Timigs
                                </Typography>
                                <Typography variant="h2" style={{fontSize:"20px",fontWeight:"bold",color:"#FFFF"}}>
                                    {profileData.shiftTimes}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Conformation open={ConformationBoxVisibility} onClose={() => setConformationBoxVisibility(false)}  onAction={handleConfirmationAction}  data={conformationBoxData} />
                    <NotificationComponent backgroundColor={notificationData.color} message={notificationData.message} open={notificationData.visibility} onClose={() => setNotificationData((pre)=>({...pre,visibility:false}))} />
                </Grid>
            </Grid>
              <TimerComponent/>
        </div>
    )

  return (
            <div  >
                {loading && <Loader />}
                {isMobileOrMediumScreen ? (
                    <div style={{ backgroundColor: '#FFFFFF', padding: '0px', position: 'relative', top: '10vh' }}>
                        {body}
                    </div>
                ) : (
                    <div style={{ backgroundColor: '#FFFFFF', padding: '0px', position: 'relative', top: '10vh', marginLeft: '35vh' }}>
                        {body}
                    </div>
                )}
            </div>
  )
}

export default Profile;
