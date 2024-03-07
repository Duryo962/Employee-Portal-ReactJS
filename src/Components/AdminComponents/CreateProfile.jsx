import { Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Loader from '../Loader/Loader';
import './profile.css'
import { DangerColor, SuccessColor, ThemeColor } from '../ENV Values/envValues';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { CreateUserCredentials, getNameValurPairByType, sendWelcomeMail,} from '../../ProfileApiCalls/AdminAPI/CreateProfileApiCalls';
import dayjs from 'dayjs';
import { createEMployee, getAllEMployeesNames, getProfileById } from '../../ProfileApiCalls/profile/Apicalls';
import Conformation from '../Conformation Component/Conformation';
import NotificationComponent from '../Notification/NotificationComponent';
import { insertShiftimings } from '../../ProfileApiCalls/WorkInformationApiCalls/ShiftTimingsApi';
import { createReportingManager } from '../../ProfileApiCalls/WorkInformationApiCalls/WorkInformationApi';
import TimerComponent from '../TimeOutComponent/TimeOut';
function CreateProfile() {
    const isMobileOrMediumScreen = useMediaQuery((theme) => theme.breakpoints.down('sm') || theme.breakpoints.down('md') || theme.breakpoints.down('xs'));
    const [loading, updateLoading] = useState(false);
    const [designationList,setDesignationList]=useState([]);
    const [userId,setUserId]=useState('');
    const [workFromLocationList,setWorkFromLocationList]=useState([]);
    const [shiftTimingsList,setShiftTimingsList]=useState([]);
    const[allEmployeesNames,SetAllemloyeesNames]=useState([]);
    const [operation,setOperation]=useState('');
    const [doj,setDoj]=useState(null)
    const [selectedDays, setSelectedDays] = useState([]);
    const [uncheck,setUncheck]=useState(false);
    const [userCredentials,setUserCredentials]=useState({
        userId:'',
        password:'',
    })
    const [profileInformation,setProfileInformation]=useState({
        employeeID:'',
        employeeName:'',
        designation:'',
        emailId:'',
        dateOfJoining:'',
        mobileNumber:'',
        reportingManager:'',
        workFrom:'',
        shiftTimes:'',
        about:'',
        themeColor:'#144982'
    })
    const [errorMessage,SetErrorMessage]=useState({
        empId:'',
        empName:'',
        emailId:'',
        designation:'',
        mobileNumber:'',
        doj:'',
        rm:'',
        working:'',
        shiftTimings:'',
        weekDays:''
    })
    const[notificationData,setNotificationData]=useState({
        color:'',
        message:'',
        visibility:false
    })
    const [conformation,setConformation]=useState({
        data:'',
        visibility:false
    })
    const [reportimgManagerInformation,setreportingmanagerData]=useState({
        managerName:'',
        startDate:null,
        endDate:null,
        modifiedDate:new Date(),
        modifiedBy:'',
        employeeId:'',
        employeeName:''
    });

    const [shifttimesData,setShiftTimeData]=useState({
        employeeName:'',
        employeeId:'',
        startDate:'',
        endDate:'',
        shiftStartTime:'',
        shiftEndTime:'',
        weekOffDays:'',
        modifiedBy:"",
        modifiedDate:'',
    })

    useEffect(() => {
        const userId=localStorage.getItem('userId');
        setUserId(userId);
        fetchData();
    }, []);

    useEffect(()=>{
        if(userId)
        {
            fetchEmployeeDetails();
        }

    },[userId])

    const fetchEmployeeDetails = async () => {
        try 
          {
            const user = await getProfileById(userId);
            setreportingmanagerData((pre)=>({
                ...pre,
                modifiedBy:user.data.employeeID+'-'+user.data.employeeName,
                modifiedDate:new Date(),

            }))

            setShiftTimeData((pre)=>({
                ...pre,
                modifiedDate:new Date(),
                modifiedBy:user.data.employeeID+' - '+user.data.employeeName,
            }))
          } 
        catch(e) 
          {
            console.log("Error fetching user details:", e);
            return null;
          }
    };

    useEffect(()=>{
        setShiftTimeData((pre)=>({
            ...pre,
            weekOffDays:selectedDays.join(', '),
        }))
    },[selectedDays])

    
    const fetchData = async () => {
        try {
            // updateLoading(true)
            await getDesignationListData();
            await new Promise(resolve => setTimeout(resolve, 2000));
            await getWorkFromLocationListData();
            await new Promise(resolve => setTimeout(resolve, 2000));
            await getShiftTimingsListData();
            await new Promise(resolve => setTimeout(resolve, 2000));
            await getAllEmployeesNames()
            // updateLoading(false);
        } catch (error) {
            // Handle errors
        }
    };

    const getDesignationListData=async()=>{
        try
            {
                const listOfDesignations=await getNameValurPairByType("Designation");
                setDesignationList(listOfDesignations.data);
            }
        catch(e)
            {
                console.log("Unable to fetching List of Designations data in create profile componenet")
            }
    }

    const getWorkFromLocationListData=async()=>{
        try
            {
                const listOfWorkFromLocation=await getNameValurPairByType("Workfromlocation");
                setWorkFromLocationList(listOfWorkFromLocation.data);
            }
        catch(e)
            {
                console.log("Unable to fetching List of work from location data in create profile componenet")
            }
    }

    const getShiftTimingsListData=async()=>{
        try
            {
                const listOfShiftTimings=await getNameValurPairByType("Shifttimings");
                setShiftTimingsList(listOfShiftTimings.data);
            }
        catch(e)
            {
                console.log("Unable to fetching List of work from location data in create profile componenet")
            }
    }

    const getAllEmployeesNames=async()=>{
        try{
            const allemplNames=await getAllEMployeesNames();
            SetAllemloyeesNames(allemplNames.data);
        }
        catch(e)
        {
            console.log("Unable to fetching all employees data")
        }
    }

    function validations(){
        let isValid=true;
        // Employee id validation
        if(!profileInformation.employeeID)
            {   
                SetErrorMessage((pre)=>({...pre,empId:"Enter employee id"}));
                isValid=false;
            }
        else
            {
                SetErrorMessage((pre)=>({...pre,empId:""}));
            }

        // Employee name validation
        if(!profileInformation.employeeName)
            {   
                SetErrorMessage((pre)=>({...pre,empName:"Enter employee name"}));
                isValid=false;
            }
        else
            {
                SetErrorMessage((pre)=>({...pre,empName:""}));
            }
        // Designation
        if(!profileInformation.designation)
            {   
                SetErrorMessage((pre)=>({...pre,designation:"Select Designation"}));
                isValid=false;
            }
        else
            {
                SetErrorMessage((pre)=>({...pre,designation:""}));
            }
        //  Mail id
        if(!profileInformation.emailId)
            {   
                SetErrorMessage((pre)=>({...pre,emailId:"Enter email id"}));
                isValid=false;
            }
        else
            {
                SetErrorMessage((pre)=>({...pre,emailId:""}));
            }
        // Mobile Number
        if (!profileInformation.mobileNumber) {
            SetErrorMessage((prev) => ({ ...prev, mobileNumber: "Enter mobile Number" }));
            isValid = false;
        } else if (profileInformation.mobileNumber.length !== 10) {
            SetErrorMessage((prev) => ({ ...prev, mobileNumber: "Mobile Number must be 10 digits" }));
            isValid = false;
        } else {
            SetErrorMessage((prev) => ({ ...prev, mobileNumber: "" }));
        }
        
        // Date of joining
        if(!profileInformation.dateOfJoining)
            {   
                SetErrorMessage((pre)=>({...pre,doj:"select date of joining"}));
                isValid=false;
            }
        else
            {
                SetErrorMessage((pre)=>({...pre,doj:""}));
            }
        // Reporting Manager
        if(!profileInformation.reportingManager)
            {   
                SetErrorMessage((pre)=>({...pre,rm:"Select reporting manager"}));
                isValid=false;
            }
        else
            {
                SetErrorMessage((pre)=>({...pre,rm:""}));
            }
        // work from location
        if(!profileInformation.workFrom)
            {   
                SetErrorMessage((pre)=>({...pre,working:"select work from location"}));
                isValid=false;
            }
        else
            {
                SetErrorMessage((pre)=>({...pre,working:""}));
            }
        // Shift timings
            if(!profileInformation.shiftTimes)
            {   
                SetErrorMessage((pre)=>({...pre, shiftTimings:"Select shift timings"}));
                isValid=false;
            }
        else
            {
                SetErrorMessage((pre)=>({...pre,shiftTimings:""}));
            }
        // Shift  days 
        if(!shifttimesData.weekOffDays)
            {
                SetErrorMessage((pre)=>({...pre, weekDays:"Select week days"}));
                isValid=false;
            }
        else
            {
                SetErrorMessage((pre)=>({...pre, weekDays:""}));
            }

            return isValid;
    }

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
          setSelectedDays([...selectedDays, value]);
        } else {
          setSelectedDays(selectedDays.filter(day => day !== value));
        }
    };

    const extractTimeValues = (shiftTime) => {
        const timeString = shiftTime;
        const regex = /\(([^)]+)\)/;
        const matches = regex.exec(timeString);
        if (matches && matches.length >= 2) {
          const times = matches[1].split(" To ");
          setShiftTimeData((pre)=>({...pre,shiftStartTime:times[0],shiftEndTime:times[1]}))
        }
    };

    const createProfile=async()=>{
        const validationRes=validations();
        console.log(shifttimesData,reportimgManagerInformation)
        if(validationRes===true)
        {
            setOperation('Create Profile')
          const confirmationData=`Are you sure you want to Create employee profile\nEmployee ID : ${profileInformation.employeeID}\nEmployee Name: ${profileInformation.employeeName}\nDesignation:${profileInformation.designation}\nMail ID :${profileInformation.emailId}\nMobile Number : ${profileInformation.mobileNumber}\n Date of joining :${profileInformation.dateOfJoining}\nReporting manager :${profileInformation.reportingManager}\nWork from location :${profileInformation.workFrom}\nShift timings :${profileInformation.shiftTimes}\nAbout:${profileInformation.about}`;
          setConformation((pre)=>({
            ...pre,
            data:confirmationData,
            visibility:true,
          }))
         
        }
    }
    
    const handleConfirmationAction =async(result) => {
        if(result==='ok')
        {
          if(operation==='Create Profile')
          {
            try{
                updateLoading(true);
                const createEMployeeApires=await createEMployee(profileInformation);
                
                if (createEMployeeApires && createEMployeeApires.Status === 'CREATED') {
                    setNotificationData((prev) => ({
                        ...prev,
                        color: SuccessColor,
                        message: createEMployeeApires.Message,
                        visibility: true,
                    }));
                    setProfileInformation({
                        about: "",
                        dateOfJoining: "",
                        designation: "",
                        emailId: "",
                        employeeID: "",
                        employeeName: "",
                        mobileNumber: "",
                        reportingManager: "",
                        shiftTimes: "",
                        workFrom: ""
                    });
                    setDoj(null);
                   
                    // Create Shift Timings
                    setTimeout(async () => {
                        const result=await insertShiftimings(shifttimesData);
                        // console.log("Create shift timings MS API result : ",result);setSelectedDays
                        if(result && result.Status==="OK")
                        {
                            setNotificationData((pre)=>({
                                ...pre,
                                color:SuccessColor,
                                message:result.Message,
                                visivility:true,
                            }))
                            setUncheck(true);
                        }
                        else
                        {
                            setNotificationData((pre)=>({
                                ...pre,
                                color:DangerColor,
                                message:result.Message,
                                visivility:true,
                            }))
                        }
                    }, 1000); 

                    // Create reporting manager
                    setTimeout(async () => {
                        const updateRMApiResult=await createReportingManager(reportimgManagerInformation);
                        // console.log("Update reporting manager MS API result : ",updateRMApiResult)
                        if(updateRMApiResult && updateRMApiResult.Status==="CREATED")
                        {
                            setNotificationData((pre)=>({
                                ...pre,
                                color:SuccessColor,
                                message:updateRMApiResult.Message,
                                visibility:true,
                            }))
                        }
                        else
                        {
                            setNotificationData((pre)=>({
                                ...pre,
                                color:DangerColor,
                                message:updateRMApiResult.Message,
                                visibility:true,
                            }))
                        }
                    }, 1000);

                    // send welcome mail
                    setTimeout(async () => {
                        const sendWelcomeMailRes=await sendWelcomeMail(profileInformation.employeeID,profileInformation.employeeName,profileInformation.emailId,userCredentials.password,profileInformation.designation);
                         // console.log("Send welcome mail MS API result : ",sendWelcomeMailRes)
                        if(sendWelcomeMailRes && sendWelcomeMailRes.Status==="OK")
                        {
                            setNotificationData((pre)=>({
                                ...pre,
                                color:SuccessColor,
                                message:sendWelcomeMailRes.Message,
                                visibility:true,
                            }))
                        }
                        else
                        {
                            setNotificationData((pre)=>({
                                ...pre,
                                color:DangerColor,
                                message:sendWelcomeMailRes.Message,
                                visibility:true,
                            }))
                        }
                    }, 1000);

                    // Create User credentials
                    setTimeout(async () => {
                        const userCredentialsInsertAPiRes=await CreateUserCredentials(userCredentials);
                        if(userCredentialsInsertAPiRes && userCredentialsInsertAPiRes.Status==="OK")
                        {
                            setNotificationData((pre)=>({
                                ...pre,
                                color:SuccessColor,
                                message:userCredentialsInsertAPiRes.Message,
                                visibility:true,
                            }))
                        }
                        else
                        {
                            setNotificationData((pre)=>({
                                ...pre,
                                color:DangerColor,
                                message:userCredentialsInsertAPiRes.Message,
                                visibility:true,
                            }))
                        }
                    }, 1000);
                    updateLoading(false);
                } else {
                    setNotificationData((prev) => ({
                        ...prev,
                        color: DangerColor,
                        message: createEMployeeApires.Message,
                        visibility: true,
                    }));
                    updateLoading(false);
                }
            }
            catch(e){
                updateLoading(false);
                console.log(e)
                setNotificationData((pre)=>({
                    ...pre,
                    color:DangerColor,
                    message:"Unable to creating employeeprofile",
                    visibility:true,
                }))
            }
          }
        }
    
    }
   

    const body=(
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start',overflow:"auto", height: '90vh' ,paddingtop:'-12px'}}>
              <Grid container spacing={1} style={{ flex: 1 }}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Grid container spacing={1}>
                        {/* Heading */}
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div >
                                <h1 style={{color:ThemeColor.Color, fontFamily: 'emoji',fontSize: '2em',fontWeight: 'bold',}} >Create Profile</h1>
                            </div>
                        </Grid>

                        {/* Horizontal Line */}
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <hr style={{ background: ThemeColor.Color , color:ThemeColor.Color , borderColor: ThemeColor.Color , height: '3px', maxWidth: "100%", width: "90%" ,position: 'relative',top: '-20px'}}></hr>
                        </Grid>

                        {/* Days Display */}
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div>
                                <div>
                                    <Typography variant='p' sx={{color:ThemeColor.Color,fontSize:'15px',fontWeight:'bold'}}> Select Week Off Days</Typography>
                                </div>
                                <div>
                                    <FormControlLabel control={<Checkbox onChange={handleCheckboxChange} value="Monday"    />}label="Mon"/>
                                    <FormControlLabel control={<Checkbox onChange={handleCheckboxChange} value="Tuesday"   />}label="Tue"/>
                                    <FormControlLabel control={<Checkbox onChange={handleCheckboxChange} value="Wednesday" />} label="Wed"/>
                                    <FormControlLabel control={<Checkbox onChange={handleCheckboxChange} value="Thursday"  />} label="Thu"/>
                                    <FormControlLabel control={<Checkbox onChange={handleCheckboxChange} value="Friday"    />} label="Fri"/>
                                    <FormControlLabel control={<Checkbox onChange={handleCheckboxChange} value="Saturday" />}label="Sat"/>
                                    <FormControlLabel  control={<Checkbox onChange={handleCheckboxChange} value="Sunday"   />} label="Sun"/>
                                </div>
                            </div>
                        </Grid>

                        {/* Employee id field */}
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FormControl style={{width: "60%",height:"7%",}} >   
                                <TextField type='number' label="Employee Id" id="outlined-start-adornment"
                                     value={profileInformation.employeeID}
                                     onChange={(e)=>{
                                        const employeeId=e.target.value;
                                        setProfileInformation((pre)=>({...pre, employeeID:employeeId}))
                                        setreportingmanagerData((pre)=>({...pre,employeeId:employeeId}));
                                        setShiftTimeData((pre)=>({...pre,employeeId:employeeId}))
                                        setUserCredentials((pre)=>({...pre,userId:employeeId}))
                                     }}
                                     />
                            </FormControl>
                        </Grid>

                        {/* Employee Name field */}
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FormControl style={{width: "60%",height:"7%",}} >
                                <TextField type='text' label="Employee name" id="outlined-start-adornment"
                                    value={profileInformation.employeeName}
                                    onChange={(e)=>{
                                        const employeeName=e.target.value;
                                        const modifiedEmployeeName = employeeName.replace(/\s/g, '') + '@123';
                                        // console.log(modifiedEmployeeName)
                                        setUserCredentials((pre)=>({...pre,password:modifiedEmployeeName}));
                                        setProfileInformation((pre)=>({
                                            ...pre,
                                            employeeName:employeeName
                                        }))
                                        setShiftTimeData((pre)=>({...pre,employeeName:employeeName}))
                                        setreportingmanagerData((pre)=>({...pre,employeeName:employeeName}))
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        {/* Designation field */}
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FormControl style={{width:"60%",height:"7%",}} >
                                <InputLabel id="demo-simple-select-helper-label_Designation">Designation</InputLabel>
                                <Select   labelId="demo-simple-select-helper-label_Designation" id="demo-simple-select-helper_designation" label="Designation" 
                                    value={profileInformation.designation}
                                    onChange={(e)=>{
                                        const designation=e.target.value;
                                        setProfileInformation((pre)=>({
                                            ...pre,
                                            designation:designation
                                        }))
                                    }}    
                                >
                                    { designationList ? designationList.map((designation) => (  <MenuItem key={designation.id} value={designation.value}> {designation.value} </MenuItem> )): null }
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Email field */}
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FormControl style={{width: "60%",height:"7%",}} >
                                <TextField type='text' label="Mail Id" id="outlined-start-adornment" size='medium' 
                                    value={profileInformation.emailId}
                                    onChange={(e)=>{
                                        const email=e.target.value;
                                        setProfileInformation((pre)=>({
                                            ...pre,
                                            emailId:email,
                                        }))
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        {/* Mobile number field */}
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FormControl style={{width: "60%",height:"7%",}} >
                                <TextField type='number' label="Mobile Number" id="outlined-start-adornment"  
                                    value={profileInformation.mobileNumber}
                                    onChange={(e)=>{
                                        const mobile=e.target.value;
                                        setProfileInformation((pre)=>({
                                            ...pre,
                                            mobileNumber:mobile
                                        }))
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        {/* Date of joining field */}
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FormControl style={{ width: "60%", height: "100%",}} >
                                <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                                    <DemoContainer components={['DatePicker']}>
                                    <DatePicker
                                        label="Data of joining"
                                        sx={{ width: '100%' }}
                                        value={doj ? doj : null}
                                        onChange={(date) => {
                                            if (date) {
                                                const dayjsDate = dayjs(date);
                                                const formattedDate = dayjsDate.format('DD/MM/YYYY');
                                                setProfileInformation((prev) => ({
                                                    ...prev,
                                                    dateOfJoining: formattedDate + '',
                                                }));
                                                setreportingmanagerData((pre)=>({...pre,startDate:date}));
                                                setShiftTimeData((pre)=>({...pre,startDate:date}))
                                            }
                                        }}
                                    />
                                    </DemoContainer>          
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>

                        {/* About field */}
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FormControl style={{width: "60%",height:"7%",}} >
                                <TextField type='text' label="About" id="outlined-start-adornment" size='medium' 
                                    value={profileInformation.about}
                                    onChange={(e)=>{
                                        const about=e.target.value;
                                        setProfileInformation((pre)=>({
                                            ...pre,
                                            about:about
                                        }))
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        {/* Reporting Manager field */}
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FormControl style={{width:"60%",height:"7%",}} >
                                <InputLabel id="demo-simple-select-helper-label_reportingManager">Reporting Manager</InputLabel>
                                <Select   labelId="demo-simple-select-helper-label_reportingManager" id="demo-simple-select-helper_reportingManager" label="Reporting Manager"
                                    value={profileInformation.reportingManager}
                                    onChange={(e)=>{
                                        const rm=e.target.value;
                                        setProfileInformation((pre)=>({
                                            ...pre,
                                            reportingManager:rm
                                        }))
                                        setreportingmanagerData((pre)=>({...pre,managerName:rm}));
                                    }}
                                >
                                    { allEmployeesNames ? allEmployeesNames.map((empName,index) => (  <MenuItem key={index} value={empName}>{empName}</MenuItem> )): null }
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Work from location field */}
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FormControl style={{width: "60%",height:"7%",}} >
                                <InputLabel id="demo-simple-select-helper-label_workFromLocation">Workng</InputLabel>
                                    <Select   labelId="demo-simple-select-helper-label_workFromLocation" id="demo-simple-select-helper_workFromLocation" label="Workng"
                                        value={profileInformation.workFrom}
                                        onChange={(e)=>{
                                            const work=e.target.value;
                                            setProfileInformation((pre)=>({
                                                ...pre,
                                                workFrom:work
                                            }))
                                        }}
                                    >
                                        { workFromLocationList ? workFromLocationList.map((workfromlocation) => (  <MenuItem key={workfromlocation.id} value={workfromlocation.value}> {workfromlocation.value} </MenuItem> )): null }
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Shift timings field */}
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FormControl style={{width: "60%",height:"7%",}} >
                                <InputLabel id="demo-simple-select-helper-label_shifttimings">Shift Timings</InputLabel>
                                    <Select   labelId="demo-simple-select-helper-label_shifttimings" id="demo-simple-select-helper" label="Shift Timings"
                                        value={profileInformation.shiftTimes}
                                        onChange={(e)=>{
                                            const shift=e.target.value;
                                            setProfileInformation((pre)=>({
                                                ...pre,
                                                shiftTimes:shift
                                            }))
                                            extractTimeValues(shift);
                                        }}
                                    >
                                        { shiftTimingsList ? shiftTimingsList.map((shiftTime) => (  <MenuItem key={shiftTime.id} value={shiftTime.value}> {shiftTime.value} </MenuItem> )): null }
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Validations Error Message */}
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <FormControl style={{ width: "90%", height: "6%" }} >
                                <p style={{color:'#FF0000',fontSize:"15px",fontWeight:'bold'}}>{errorMessage.empId ? errorMessage.empId + (errorMessage.empId ? ',' : '') : ''}{errorMessage.empName ? errorMessage.empName + (errorMessage.empName ? ',' : '') : ''}{errorMessage.designation ? errorMessage.designation + (errorMessage.designation ? ',' : '') : ''}{errorMessage.emailId ? errorMessage.emailId + (errorMessage.emailId ? ',' : '') : ''}{errorMessage.mobileNumber ? errorMessage.mobileNumber + (errorMessage.mobileNumber ? ',' : '') : ''}{errorMessage.doj ? errorMessage.doj + (errorMessage.doj ? ',' : '') : ''}{errorMessage.rm ? errorMessage.rm + (errorMessage.rm ? ',' : '') : ''}{errorMessage.working ? errorMessage.working + (errorMessage.working ? ',' : '') : ''}{errorMessage.shiftTimings ? errorMessage.shiftTimings + (errorMessage.shiftTimings ? ',' : '') : ''}</p>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Button variant='contained' endIcon={<PersonAddAlt1Icon/>}
                                sx={{
                                    backgroundColor:ThemeColor.Color,
                                    '&:hover':{
                                        backgroundColor:ThemeColor.Color,
                                    },
                                    textTransform:'none'

                                    
                                }}
                                    onClick={createProfile}
                                >Create Profile</Button>
                        </Grid>
                        <Conformation open={conformation.visibility} onClose={() => setConformation((pre)=>({...pre,visibility:false}))}  onAction={handleConfirmationAction}  data={conformation.data} />
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

export default CreateProfile
