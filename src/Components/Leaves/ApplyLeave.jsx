import {  Autocomplete, Button,  FormControl, Grid,  InputLabel, MenuItem, Select, TextField,   useMediaQuery } from '@mui/material';
import React, {  useEffect, useState } from 'react'
import { SendLeaveMail, getLeaveType, getleaveDay, insertLeave } from '../../ProfileApiCalls/Leaves/LeavesApi';
import { getEmployeesDetails, getProfileById } from  '../../ProfileApiCalls/profile/Apicalls';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Loader from '../Loader/Loader';
import TimerComponent from '../TimeOutComponent/TimeOut';
import Conformation from '../Conformation Component/Conformation';
import SendIcon from '@mui/icons-material/Send';
import { DangerColor, SuccessColor, ThemeColor } from '../ENV Values/envValues';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import NotificationComponent from '../Notification/NotificationComponent';

function ApplyLeave() {

  const [userId,setuserID]=useState('');
  const [operationName,SetOperationName]=useState('')
  const [leaveT,UpdateLeaveT]=useState([]);
  const [loading,updatLoading]=useState(false);
  const isMobileOrMediumScreen = useMediaQuery((theme) => theme.breakpoints.down('sm') || theme.breakpoints.down('md') || theme.breakpoints.down('xs'));
  const [LeaveTypes, UpdateLeaveType] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [employeesDetails,UpdateEmployeesDetails]=useState([]);
  const[options,updateOptions]=useState([]);
  const[fromAddress,UpdateFromAddress]=useState('');
  const[toAddresses,UpdateToAddresses]=useState('');
  const[mailBody,updateMailBody]=useState('');
  const[leaveFrom,updateLeaveFrom]=useState(null);
  const[leaveto,updateLeaveTo]=useState(null);
  const[LeaveType,updateLeavety]=useState('');
  const [SingleOrMultiple,UpdateSingleOrMultiple]=useState('');
  const [confirmationData, setConfirmationData] = useState('');
  var res='';
  const [open, setOpen] = useState(false);
  const [mailData, updateMailData] = useState({
      ToAddresses: '',
      fromAddress: '',
      subject: '',
      body: '',
  });
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
  });
  const [error ,UpdateError]=useState({
    leaveTypeErr:'',
    toAddressesErr:'',
    bodyErr:'',
    fromDateErr:'',
    toDateErr:'',
    noOfDays:''
  })
  const [leaveDetails,UpdateLeaveDetails]=useState({
    employeeId:'',
    employeeName:'',
    reportingManager:'',
    leaveFromDate:null,
    leaveToDate:null,
    leaveStatus:'',
    leaveAppliedDate:new Date(),
    leaveType:'',
    leaveBody:'',
    noOfDaysLeave:''
  })
  const [notificationData,setNotificationData]=useState({
    color:'',
    message:'',
    Visibility:false,
  })

  // getting and set user id from local storage
  useEffect(()=>{
    const storedUserId = localStorage.getItem('userId');
    setuserID(storedUserId);
  },[])


  useEffect(()=>{},[loading])

  useEffect(()=>{},[leaveT])
 
  // Re initialize varables data
  function clearData() {
    updateMailData((prevMailData) => ({
      ...prevMailData,
      ToAddresses: '',
      body: '',
      fromAddress: '',
      subject: ''
    }));
              
    UpdateLeaveDetails((prevLeaveDetails) => ({
      ...prevLeaveDetails,
      leaveBody: '',
      leaveToDate: null,
      leaveType: '',
      leaveFromDate: null
    }));

    UpdateToAddresses('')
    updateMailBody('')
    updateLeaveFrom(null)
    updateLeaveTo(null)
    updateLeavety('')
    setSelectedOptions([])
    UpdateSingleOrMultiple('')
  }

  // Re initialize messages
  function clearErrors(){
    UpdateError((error)=>({...error,
      bodyErr:'',
      fromDateErr:'',
      leaveTypeErr:'',
      noOfDays:'',
      toAddressesErr:'',
      toDateErr:''
    }))
  }
          
  useEffect(()=>{},[mailData])

  useEffect(()=>{},[leaveDetails])
        
  // To Address option onchange function (array of to addreses converts into string )
  const handleOptionChange = (event, newValue) => {
    setSelectedOptions(newValue);
    const selectedValuesString = newValue.map((option) => option.value).join(',');
    updateMailData((leave) => ({ ...leave, ToAddresses: selectedValuesString }));
    UpdateToAddresses(selectedValuesString);
  };
          

  // Set to addresses label as employeeid+employee name
  useEffect(() => {
    if (employeesDetails && Array.isArray(employeesDetails)) {
        const newOptions = employeesDetails.map((employee) => ({
            label: `${employee.employeeID} (${employee.employeeName})`, 
            value: employee.emailId,
        }));

        updateOptions(newOptions);
    }
}, [employeesDetails]);


  // Validation Function
  function validations() {
    var isValid = true;

    // Validation for Leave Type
    if (!LeaveType) 
    {
      UpdateError((prevState) => ({ ...prevState, leaveTypeErr: 'Select Leave Type' }));
      isValid = false;
    } 
    else
    {
      UpdateError((prevState) => ({ ...prevState, leaveTypeErr: '' }));
    }

    // Validation for No Of day
    if (!leaveDetails.noOfDaysLeave) 
    {
      UpdateError((prevState) => ({ ...prevState, noOfDays: 'Select No Of Days Leave' }));
      isValid = false;
    } 
    else
    {
      UpdateError((prevState) => ({ ...prevState, noOfDays: '' }));
    }

    // Validation For From Addresses
    if (!toAddresses) 
    {
      UpdateError((prevState) => ({ ...prevState, toAddressesErr: 'To Addresses Not Null' }));
      isValid = false;
    } 
    else 
    {
      UpdateError((prevState) => ({ ...prevState, toAddressesErr: '' }));
    }

    // Validation For Body
    if (!mailBody) 
    {
      UpdateError((prevState) => ({ ...prevState, bodyErr: 'Enter Body' }));
      isValid = false;
    } 
    else 
    {
      UpdateError((prevState) => ({ ...prevState, bodyErr: '' }));
    }

    // Validation For FromDate
    if (leaveDetails.noOfDaysLeave !== "" ) 
    {
      if (!leaveFrom) 
      {
        UpdateError((prevState) => ({ ...prevState, fromDateErr: 'Select From Date' }));
        isValid = false;
      } 
      else 
      {
        UpdateError((prevState) => ({ ...prevState, fromDateErr: '' }));
      }
    }

    // Validation For ToDate
    if (leaveDetails.noOfDaysLeave !== "1 Day" && leaveDetails.noOfDaysLeave !== null ) 
    {
      if (leaveDetails.noOfDaysLeave !== "") 
      {
        if (!leaveto) 
        {
          UpdateError((prevState) => ({ ...prevState, toDateErr: 'Select To Date' }));
          isValid = false;
        } 
        else 
        {
          UpdateError((prevState) => ({ ...prevState, toDateErr: '' }));
        }

        if (leaveto <= leaveFrom) 
        {
          UpdateError((prevState) => ({ ...prevState, toDateErr: 'To date No before from date' }));
          isValid = false;
        } 
        else 
        {
          UpdateError((prevState) => ({ ...prevState, toDateErr: '' }));
        }

      } 
                
    }
                
    return isValid;
  }
         
  // When  Update Email id Update UpdateFromAddress Method
  useEffect(() => {
    UpdateFromAddress(profileData.emailId);
  }, [profileData.emailId]);
        
  // Declare fetchWorkDetails,fetchAllEmployeesDetails and fetchCurrentEmployeeDetails functions in onload

  useEffect(() => {
    if(userId)
    {   
      fetchData();
    }

}, [userId]);


const fetchData = async () => {
    try {
        await fetchAllEMployeesDetails();
        await fetchCurrentEmployeeDetails();
        await fetchWorkDetails();
        await new Promise(resolve => setTimeout(resolve, 2000));
        await leaveDay();
        await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
        // Handle errors
    }
};

  // Currebt Employee Details fetching and update LeaveDetails
  const  fetchCurrentEmployeeDetails=async()=>{
    try{
        const empDetails=await getProfileById(userId);
        UpdateProfileData(empDetails.data);
        UpdateLeaveDetails((leave) => ({ 
          ...leave,
          employeeId:empDetails.data.employeeID,
          employeeName:empDetails.data.employeeName,
          reportingManager:empDetails.data.reportingManager,
          leaveStatus:"Pending",
        }));
        updateMailData((leave) => ({ ...leave, fromAddress:'karagana06@gmail.com' }))
      }
    catch(e)
      {
        console.log("Error in fetching EMployee Details : ",e)
      }
  }


  function updateToDate(leaveDays){
    if(leaveDays==='1 Day')
      {
        updateLeaveTo(null);
        UpdateLeaveDetails((leave) => ({ ...leave, leaveToDate: null }));
      }
  }

  //  Calculate Days between from and to dates
  function validateDays() {
    if (leaveDetails.leaveFromDate && leaveDetails.leaveToDate && leaveDetails.noOfDaysLeave) 
    {
        const toDate = new Date(leaveDetails.leaveToDate);
        const fromDate = new Date(leaveDetails.leaveFromDate);
        const timeDifference = toDate.getTime() - fromDate.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        const days = daysDifference + 1 + " Days";
        if (daysDifference+1 > 10) 
          {
            if (leaveDetails.noOfDaysLeave === '>10 Days') 
              {
                return "Matched";
              } 
              else 
              {
                return "Unmatched";
              } 
          } 
        else 
          {
            if (leaveDetails.noOfDaysLeave === days) 
              {
                return "Matched";
              } 
            else 
              {
                return "Unmatched";
              }
          }
    }
    else if(leaveDetails.leaveFromDate && leaveDetails.leaveToDate === null && leaveDetails.noOfDaysLeave)
    {
      return "Matched";
    }
  }

  const formatDate = (date) => {
    // Adjust timezone offset
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    // Format date as desired (e.g., YYYY-MM-DD)
    const formattedDate = adjustedDate.toISOString().split('T')[0];
    return formattedDate;
};
            

  // Create leave Button Onclick Function
  const  SubmitLeaveDetails=async ()=>{
    const validationRes=validations();
    const Days= validateDays();
    if(validationRes===true && Days==='Matched')
      {
        clearErrors();
        SetOperationName("InsertLeave")
        const fromDate = dayjs(leaveDetails.leaveFromDate).format('DD-MM-YYYY');
        const toDate = dayjs(leaveDetails.leaveToDate).format('DD-MM-YYYY');
        const confirmationMessage = `Are you sure you want to Apply leave?\nLeave Type: ${leaveDetails.leaveType}\n From Address: ${mailData.fromAddress}\nTo Addresses: ${mailData.ToAddresses}\nSubject: ${mailData.subject}\nNo of Days leave: ${leaveDetails.noOfDaysLeave}\nLeave From Date: ${fromDate}\nLeave To Date: ${toDate}\nBody: ${mailData.body}`;
        setConfirmationData(confirmationMessage);
        setOpen(true);
      }
    else
      {
        if(Days==='Unmatched')
          {
            UpdateError((error)=>({...error,noOfDays:"Your Selected No of Days Leave and Dates Not matched"}))
          }
      }

  }




  // Fetching Work Details Functionfrom MS API
  const fetchWorkDetails = async () => {
    try 
      {
        const LeaveTypes = await getLeaveType();
        UpdateLeaveType(LeaveTypes.data);
      }
    catch(error) 
      {
        console.error('Error fetching data:', error);
      }
  };

  // Fetching All Employees Details From MS API
  const fetchAllEMployeesDetails = async () => {
    try 
      {
        const LeaveTypes = await getEmployeesDetails();
        UpdateEmployeesDetails(LeaveTypes.data);
      } 
    catch(error) 
      {
        console.error('Error fetching data:', error);
      }
  };

  // Fetching leave Days types
  const leaveDay=async ()=>{
    try
      {
        const resu=await getleaveDay();
        UpdateLeaveT(resu.data)
      }
    catch(e)
      {
        console.log("Error to fetching single day or multiple days ")
      }
  }

  const handleConfirmationAction =async(result) => {
    if(result==='ok')
    {
      if(operationName==='InsertLeave')
      {
        try
              {
                updatLoading(true);
                const result= await insertLeave(leaveDetails);
                if(result && result.Status==="CREATED")
                {
                  setNotificationData((pre)=>({
                    ...pre,
                    color:SuccessColor,
                    message:result.Message,
                    Visibility:true,
                  }))  

                  setTimeout(async () => {
                    const mailres=await SendLeaveMail(mailData);
                    if(mailres && mailres.Status==="OK")
                    {
                      clearData();
                      updatLoading(false);  
                      setNotificationData((pre)=>({
                        ...pre,
                        color:SuccessColor,
                        message:mailres.Message,
                        Visibility:true,
                      }))
                    }
                    else
                    {
                      updatLoading(false);  
                      setNotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        message:mailres.Message,
                        Visibility:true,
                      }))
                    }     
                }, 2000);
              }
              else
              {
                setNotificationData((pre)=>({
                  ...pre,
                  color:DangerColor,
                  message:result.Message,
                  Visibility:true,
                })) 
              }                 
             }
            catch(e)
             {
                updatLoading(false);
                setNotificationData((pre)=>({
                  ...pre,
                  color:DangerColor,
                  message:"Unable to apply leave. Please try again.",
                  Visibility:true,
                }))
                           
             }
      }

    }
  };
            
          
    const body = (
        <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start',overflow:"auto", height: '90vh' }}>
          <Grid container spacing={1.0} style={{ flex: 1 }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Grid container spacing={1.0}>
                {/* Heading */}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <div >  
                    <h1 style={{color:ThemeColor.Color, fontFamily: 'emoji',fontSize: '2em',fontWeight: 'bold',}} > Apply Leave</h1>
                  </div>
                </Grid>

                {/* Horizontal Line Grid */}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <hr style={{ background: ThemeColor.Color , color: ThemeColor.Color , borderColor: ThemeColor.Color , height: '3px', maxWidth: "100%", width: "90%" ,paddingTop:''}}></hr>
                </Grid>

                {/* Leave type */}
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Box display="flex" justifyContent="center">
                  <FormControl style={{ width: "80%", height: "6%" }} >
                    <InputLabel id="demo-simple-select-helper-label">LeaveType</InputLabel>
                    <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" label="LeaveType" value={LeaveType} onChange={(e)=>{updateLeavety(e.target.value);var leaveType = e.target.value; UpdateLeaveDetails((leave) => ({ ...leave, leaveType:leaveType })); updateMailData((leave) => ({ ...leave, subject:"Applying For "+e.target.value +" ( "+profileData.employeeID +" "+profileData.employeeName+"  )"}));}}>
                      {LeaveTypes && LeaveTypes.map((leave) => ( <MenuItem key={leave.id} value={leave.name}>{leave.value}</MenuItem>))}
                    </Select>
                  </FormControl>
                  </Box>
                </Grid>

                {/* Single Day or multiple Days */}
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <FormControl style={{ width: "80%", height: "6%" }} >
                    <InputLabel id="demo-simple-select-helper-label">No Of Days Leave</InputLabel>
                    <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" label="No Of Days Leave" value={SingleOrMultiple} onChange={(e)=>{UpdateSingleOrMultiple(e.target.value);const val=e.target.value; UpdateLeaveDetails((leave) => ({ ...leave, noOfDaysLeave:val }));updateToDate(val);}}>
                      {leaveT && leaveT.map((leave) => ( <MenuItem key={leave.id} value={leave.name}>{leave.value}</MenuItem>))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* To Addresses */}
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <FormControl style={{ width: "80%", height: "6%" }} >
                    <Autocomplete  value={selectedOptions}  onChange={handleOptionChange} options={options} getOptionLabel={(option) => option.label} isOptionEqualToValue={(option, value) => option.value === value.value} renderInput={(params) => (  <TextField {...params} label="To Addresses" variant="outlined" /> )}  multiple/>
                  </FormControl>
                </Grid>

                {/* Body */}
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <FormControl style={{ width: "80%", height: "6%" }} >
                    <TextField id="outlined-multiline-flexible"label="Body" multiline maxRows={4} variant="outlined" value={mailBody} onChange={(e) => {   updateMailBody(e.target.value);var body=e.target.value; UpdateLeaveDetails((leave) => ({ ...leave, leaveBody:body })); updateMailData((leave) => ({ ...leave, body:e.target.value}))}}/>
                  </FormControl>
                </Grid>

                {/* From Date */}
                {SingleOrMultiple !== '' && (
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <FormControl style={{ width: "80%", height: "100%" }} >
                    <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                      <DemoContainer components={['DatePicker']}>
                        <DatePicker label="From  Date"  sx={{width:'100%'}}
                          value={leaveFrom}        
                          onChange={(date) => {
                          updateLeaveFrom(date);
                          UpdateLeaveDetails((leave) => ({ ...leave, leaveFromDate:date }));
                          }}
                          minDate={dayjs(new Date())}
                        />
                      </DemoContainer>
                                                        
                    </LocalizationProvider>
                  </FormControl>
                </Grid>
                )}

                {/* To Date */}
                {SingleOrMultiple !== '1 Day' && SingleOrMultiple !== '' && (
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <FormControl style={{ width: '80%', height: '100%' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                      <DemoContainer components={['DatePicker']}>
                        <DatePicker
                          label="To Date"
                          sx={{ width: '100%' }}
                          value={leaveto}
                          onChange={(date) => {
                          updateLeaveTo(date);
                          UpdateLeaveDetails((leave) => ({ ...leave, leaveToDate: date }));
                          }}
                          minDate={dayjs(new Date())}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </FormControl>
                </Grid>
                )}

                {/* Validations Error Message */}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <FormControl style={{ width: "90%", height: "6%" }} >
                    <p style={{color:'#FF0000',fontSize:"15px",fontWeight:'bold'}}>{error.leaveTypeErr ? error.leaveTypeErr + (error.leaveTypeErr ? ',' : '') : ''} {error.noOfDays ? error.noOfDays + (error.noOfDays ? ',' : '') : ''}{error.toAddressesErr ? error.toAddressesErr + (error.toAddressesErr ? ',' : '') : ''}{error.bodyErr ? error.bodyErr + (error.bodyErr ? ',' : '') : ''} {error.fromDateErr ? error.fromDateErr + (error.fromDateErr ? ',' : '') : ''}{error.toDateErr ? error.toDateErr : ''}</p>
                  </FormControl>
                </Grid>

                {/* Apply leave Button */}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <FormControl style={{ width: "30vh",gap:'4px' }} >
                    <Button variant="contained"  style={{backgroundColor:ThemeColor.Color ,textTransform:'none'}}onClick={() => { SubmitLeaveDetails() }} endIcon={<SendIcon/>}>Apply Leave</Button>
                  </FormControl>
                </Grid>

              </Grid>
            </Grid>
          </Grid>
            <Conformation open={open} onClose={() => setOpen(false)}  onAction={handleConfirmationAction}  data={confirmationData} />
            <NotificationComponent backgroundColor={notificationData.color} message={notificationData.message} onClose={()=>{setNotificationData((pre)=>({...pre,Visibility:false}))}} open={notificationData.Visibility}/>
            <TimerComponent/>
        </div>
    );
  
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
  

  
export default ApplyLeave;
