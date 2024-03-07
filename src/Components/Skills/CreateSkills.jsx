import { Button, FormControl,  Grid, InputLabel, MenuItem, Select,  TextField, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getSkills, getWorkingDetails, insertSkill } from '../../ProfileApiCalls/Skills/CreateSkillsApiCall';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { getProfileById } from '../../ProfileApiCalls/profile/Apicalls';
import Loader from '../Loader/Loader';
import TimerComponent from '../TimeOutComponent/TimeOut';
import { DangerColor, SuccessColor, ThemeColor } from '../ENV Values/envValues';
import Conformation from '../Conformation Component/Conformation';
import dayjs from 'dayjs';
import NotificationComponent from '../Notification/NotificationComponent';
import SendIcon from '@mui/icons-material/Send';
function CreateSkills() {
  const [userId,setuserID]=useState('')
  const [loading,updatLoading]=useState(false)
  const isMobileOrMediumScreen = useMediaQuery((theme) => theme.breakpoints.down('sm') || theme.breakpoints.down('md') || theme.breakpoints.down('xs'));
  const [skills,updateSkills]=useState([]);
  const [working,UpdateWorking]=useState([]);
  const [confirmationData, setConfirmationData] = useState('');
  const [open, setOpen] = useState(false);
  const [operationName,setOperationName]=useState('')
  //   Current Employee Data Initialize
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

  //  kill Data Variables Initialize
  const [skillsData,UpdateSkillsData]=useState({
    working:"",
    companyName:"",
    skill:"",
    employeeName:"",
    employeeId:"",
    startDate:null,
    endDate:null,
    skillsPeriodDays:0
  })

  //  Error variables Initialize
  const [error,updateError]=useState({
    workErr:'',
    companyErr:'',
    skillsErr:'',
    startDateErr:"",
    endDateErr:"",
  })
  const [notificationData,setNotificationData]=useState({
    color:'',
    message:'',
    visibility:false,
  })

  //  Reset Skill  Variables Data
  function InitializeSkillData(){
    UpdateSkillsData((skill) => ({ 
      ...skill,
      working: '',
      companyName:'',
      endDate:null,
      skill:"",
      startDate:"",
      skillsPeriodDays:"",
    }));

  }

     
  // Loader 
  useEffect(()=>{},[loading]);

  // Getting userid from local storage and set userid to local vriable
  useEffect(()=>{
    const storedUserId = localStorage.getItem('userId');
    setuserID(storedUserId);
  },[])

  // Fetching skills and working details onload function using useeffect
  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    try {
        await fetchWorkDetails();
        await  fetchEmployeeDetails();
        await new Promise(resolve => setTimeout(resolve, 2000));
        await  fetchSkills();
    } catch (error) {
        // Handle errors
    }
};

       
  // Getting Skills From DB Function
  const fetchSkills = async () => {
    try 
      {
        const skills = await getSkills();
        updateSkills(skills.data);
      } 
    catch(error) 
      {
        console.error('Error fetching data:', error);
      }
  };

  // Getting Working Details From DB Function
  const fetchWorkDetails = async () => {
    try 
      {
        const workDetails = await getWorkingDetails();
        UpdateWorking(workDetails.data);
      }
    catch(error)
      {
        console.error('Error fetching data:', error);
      }
  };   

  // Fetch Current EMployee Details
  const fetchEmployeeDetails = async () => {
    try 
      {
        const user = await getProfileById(userId);
        UpdateProfileData(user.data);
      } 
    catch(e) 
      {
        console.log("Error fetching user details:", e);
        return null;
      }
  };

  // Validation Function
  function validations() {
    var isValid = true;
    // Company Validation
    if (!skillsData.companyName) 
      {
        updateError((prevState) => ({ ...prevState, companyErr: 'Enter Company' }));
        isValid = false; 
      } 
    else 
      {
        updateError((prevState) => ({ ...prevState, companyErr: '' }));
      }
                
    // Work Validation
    if (!skillsData.working) 
      {
        updateError((prevState) => ({ ...prevState, workErr: 'Select Work' }));
        isValid = false; 
      } 
    else 
      {
        updateError((prevState) => ({ ...prevState, workErr: '' }));
      }
                
    // Skills Validation
    if (!skillsData.skill) 
      {
        updateError((prevState) => ({ ...prevState, skillsErr: 'Select Skill' }));
        isValid = false; 
      } 
    else 
      {
        updateError((prevState) => ({ ...prevState, skillsErr: '' }));
      }
                
    // Start date validation
    if (!skillsData.startDate) 
      {
        updateError((prevState) => ({ ...prevState, startDateErr: 'Select Start Date' }));
        isValid = false; 
      } 
    else 
      {
        updateError((prevState) => ({ ...prevState, startDateErr: '' }));
      }
                
    // End Date Validation
    if (!skillsData.endDate) 
      {
        updateError((prevState) => ({ ...prevState, endDateErr: 'Select End Date' }));
        isValid = false; 
      } 
    else 
      {
        updateError((prevState) => ({ ...prevState, endDateErr: '' }));
      }

    if(skillsData.endDate <=skillsData.startDate)
      {
        updateError((prevState) => ({ ...prevState, endDateErr: 'Skill End Date Not Below start date' }));
        isValid = false;
      }
    else 
      {
        updateError((prevState) => ({ ...prevState, endDateErr: '' }));
      }
                
    return isValid;
  }
  

  // Clculate Days
  useEffect(()=>{ 
    const  calculateDays=()=>
    {
        const startDate = new Date(skillsData.startDate);
        const endDate = new Date(skillsData.endDate);
        if(startDate && endDate)
          {
            const timeDifference =endDate.getTime() - startDate.getTime();
            const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
            UpdateSkillsData((prevSkillsData) => ({
              ...prevSkillsData,
              skillsPeriodDays: daysDifference+1,
            }));
          }
    }
    calculateDays();
  },[skillsData])

  //  Udate Details
  useEffect(() =>{
      const updatedetails=()=>
        {
          UpdateSkillsData((prevState) => ({
            ...prevState,
            employeeName: profileData.employeeName,
            employeeId:userId,
          }));
        }
      updatedetails();
  }, [profileData]);
    

  
    const SubmitSkills = async () => {
      const vali=validations();
      if(vali===true)
        {
          const fromDate = dayjs(skillsData.startDate).format('DD-MM-YYYY');
          const toDate = dayjs(skillsData.endDate).format('DD-MM-YYYY');
          setOperationName('Create Skills')
          const confirmation=`Are you sure you want to Create Skill\nWorking : ${skillsData.working}\nCompany Name: ${skillsData.companyName}\nSkill Name :${skillsData.skill}\nSkill Date From :${fromDate}\nSkill Date To : ${toDate}\n Total Skill Days :${skillsData.skillsPeriodDays}`;
          setConfirmationData(confirmation);
          setOpen(true)
          
        }
    };

    const handleConfirmationAction =async(result) => {
      if(result==='ok')
      {
        if(operationName==='Create Skills')
        {
          try
                {
                  updatLoading(true)
                  const res= await insertSkill(skillsData);
                  // console.log("Create skill MS API result : ",res)
                  if(res && res.Status==="OK")
                  {
                    InitializeSkillData();
                    updatLoading(false); 
                    setNotificationData((pre)=>({
                      ...pre,
                      color:SuccessColor,
                      message:res.Message,
                      visibility:true,
                    }))
                  }
                  else
                  {
                    updatLoading(false); 
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
                  updatLoading(false);
                  setNotificationData((pre)=>({
                    ...pre,
                    color:DangerColor,
                    message:"Unable to Insert Skill Details",
                    visibility:true,
                  }))
                             
               }
        }
  
      }
    };
    
      const body=(
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start',overflow:"auto", height: '90vh' }}>
              <Grid container spacing={0.5} style={{ flex: 1 }}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Grid container spacing={0.5}>

                    {/* Heading */}
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <div >
                        <h1 style={{color:ThemeColor.Color, fontFamily: 'emoji',fontSize: '1.8em',fontWeight: 'bold',}} >Create Skill</h1>
                      </div>
                    </Grid>

                         {/* Horizontal Line Grid */}
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <hr style={{ background: ThemeColor.Color, color: ThemeColor.Color, borderColor: ThemeColor.Color, height: '3px', maxWidth: "100%", width: "90%" ,position: 'relative',top: '-20px'}}></hr>
                    </Grid>
                           
                    {/* Working Type */}
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <FormControl style={{width:"60%",height:"10%"}} >
                        <InputLabel id="demo-simple-select-helper-label">Workng</InputLabel>
                        <Select   labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" label="Workng" value={skillsData.working} onChange={(e) => {var work = e.target.value; UpdateSkillsData((skill) => ({ ...skill, working: work }));}}>
                          { working ? working.map((work) => (  <MenuItem key={work.id} value={work.name}> {work.value} </MenuItem> )): null }
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Company Name */}
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <FormControl style={{width:"60%",height:"10%"}} >
                        <TextField  id="outlined-basic" label="Company" variant="outlined" value={skillsData.companyName} onChange={(e) => {var company = e.target.value; UpdateSkillsData((skill) => ({ ...skill, companyName:company }));}}/>
                      </FormControl>
                    </Grid>

                    {/* Skills */}
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <FormControl style={{width:"60%",height:"10%"}} >
                        <InputLabel id="demo-simple-select-helper-label">Skills</InputLabel>
                        <Select   labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" label="Age" value={skillsData.skill}  onChange={(e) => { const selectedSkill = e.target.value; UpdateSkillsData((prevSkillsData) => ({  ...prevSkillsData,  skill: selectedSkill,  })); ;}}>
                          {skills ? skills.map((skill) => (<MenuItem key={skill.id} value={skill.name}>  {skill.value}   </MenuItem> )) : null }
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* From Date */}
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <FormControl style={{ width: "60%", height: "100%" }} >
                        <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                          <DemoContainer components={['DatePicker']}>
                            <DatePicker label="Start Date"  sx={{width:'100%'}}
                              value={skillsData.startDate || null}
                              onChange={(date) => {
                                UpdateSkillsData((skill) => ({ ...skill, startDate: date }));  
                              }}
                              
                            />
                          </DemoContainer>          
                        </LocalizationProvider>
                      </FormControl>
                    </Grid>

                    {/* To Date */}
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <FormControl style={{ width: "60%", height: "100%" }} >
                        <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                          <DemoContainer components={['DatePicker']}>
                            <DatePicker label="End Date"  sx={{width:'100%'}}
                              value={skillsData.endDate || null}        
                              onChange={(date) => {
                                UpdateSkillsData((skill) => ({ ...skill, endDate: date }));
                              }}
                              minDate={dayjs(profileData.dateOfJoining)}
                            />
                          </DemoContainer>      
                        </LocalizationProvider>
                      </FormControl>
                    </Grid>

                    {/* Validations Error Message */}
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <FormControl style={{ width: "100%", height: "4%" }} >
                        <p style={{color:'#FF0000',fontSize:"12px",fontWeight:'bold'}}>{error.companyErr ? error.companyErr + (error.companyErr ? ',' : '') : ''}{error.endDateErr ? error.endDateErr + (error.endDateErr ? ',' : '') : ''}{error.skillsErr ? error.skillsErr + (error.skillsErr ? ',' : '') : ''}{error.startDateErr ? error.startDateErr + (error.startDateErr ? ',' : '') : ''}{error.workErr ? error.workErr + (error.workErr ? ',' : '') : ''}</p>
                      </FormControl>
                    </Grid>

                    {/* Create Skill Button */}
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <FormControl style={{ width:isMobileOrMediumScreen ? "40%":"20%", height: "10%" }} >
                        <Button variant="contained" style={{backgroundColor:ThemeColor.Color,textTransform:'none'}}  size='large'onClick={SubmitSkills} endIcon={<SendIcon/>}>Create Skill</Button>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Conformation open={open} onClose={() => setOpen(false)}  onAction={handleConfirmationAction}  data={confirmationData} />
              <NotificationComponent backgroundColor={notificationData.color} message={notificationData.message} onClose={()=>{setNotificationData((pre)=>({...pre,visibility:false}))}} open={notificationData.visibility}/>
              <TimerComponent/>
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
  )
}
  
export default CreateSkills;
