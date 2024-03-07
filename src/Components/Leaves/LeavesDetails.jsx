import { Button, CircularProgress,  Grid, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { getEmployeeLeaveDetails } from '../../ProfileApiCalls/Leaves/LeavesApi';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import Loader from '../Loader/Loader';
import TimerComponent from '../TimeOutComponent/TimeOut';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DangerColor, SuccessColor, ThemeColor } from '../ENV Values/envValues';
import StyledDataGrid from '../TableCOmponent/Displaytable';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PDFGenerator from '../ConvertPDF/PDFGenerator';
import NotificationComponent from '../Notification/NotificationComponent';
import { getProfileById } from '../../ProfileApiCalls/profile/Apicalls';
import ConvertExcelFile from '../Convert Excel/convertExcelFile';
import LogoImage from '../../Components/Images/excel-3-xl.png';
function LeavesDetails() {

  const [userId,setuserID]=useState('')
  const isMobileOrMediumScreen = useMediaQuery((theme) => theme.breakpoints.down('sm') || theme.breakpoints.down('md') || theme.breakpoints.down('xs'));
  const [leaveDetails,UpdateLeaveDetails]=useState([]);
  const [loading,updatLoading]=useState(false);
  const [generatePDF, setGeneratePDF] = useState(false);
  const [generateExcel,setGenerateExcel]=useState(false);
  const [notificationData,setNotificationData]=useState({
    coloe:'',
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

  // Converting date formate as (DD-MM-YYYY)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

    // Declare columns
  const columns = [
        { field: 'leaveType', headerName: 'Leave Type', width: 170 },
        { field: 'noOfDaysLeave', headerName: 'No Of Days', width: 120 },
        { field: 'leaveFromDate', headerName: 'Leave From Date', width:140,valueFormatter: (params) => formatDate(params.value) ? formatDate(params.value):'' },
        { field: 'leaveToDate', headerName: 'Leave To Date', width: 150,valueFormatter: (params) => formatDate(params.value) ? formatDate(params.value):''},
        {field: 'leaveBody',headerName: 'Leave Description', width:202,},
        { field: 'reportingManager', headerName: 'Reporting Manager', width: 150,},
        { field: 'leaveAppliedDate', headerName: 'Leave Applied Date', width: 140, valueFormatter: (params) => formatDate(params.value) ? formatDate(params.value):''},
        { field: 'leaveStatus', headerName: 'Status', width: 80,
            renderCell: (params) => (
                <>
                  {params.value === 'Approved' ? (
                    <CheckCircleIcon sx={{ color: '#4CAF50' }} />
                  ) : params.value === 'Rejected' ? (
                    <CancelIcon sx={{ color: '#F44336' }} />
                  ) : params.value === 'Pending' ? (
                    <PendingIcon sx={{ color: '#FFCC00' }} />
                  ): null}
                </>
              ),
        }
  ];

  // Getting user id from local storage and set userid to local variable
  useEffect(()=>{
    const storedUserId = localStorage.getItem('userId');
    setuserID(storedUserId);
  },[])

  // If userid is present then fetching current employee leave details
  useEffect(()=>{
    if(userId)
      {
        fetchEmployeeLeavesDetails();
        fetchCurrentEmployeeDetails();
      }
  },[userId])

  const fetchCurrentEmployeeDetails=async()=>{
    try{
       const empData=await getProfileById(userId);
       UpdateProfileData(empData.data);
    }
    catch(e)
    {
      console.log("Error to fetching current user data in leave details component");
    }
  }

    // This useEffect is use to when ever leaveDetails Updated this one is used to update Leave Details
  useEffect(()=>{},[leaveDetails])

    // Fetching Current Employee Details Function Implmentation
  const fetchEmployeeLeavesDetails = async () => {
    try 
      {
        updatLoading(true);
        const leaveDetailsResponseRes = await getEmployeeLeaveDetails(userId);
        // console.log("Current employee leave details API result : ",leaveDetailsResponseRes)
        if(leaveDetailsResponseRes && leaveDetailsResponseRes.Status==="FOUND")
            {
              const leaveDetailsResponse=leaveDetailsResponseRes.data;
              const leaveDetailsWithIds = leaveDetailsResponse.map((row, index) => ({ ...row, id: index + 1 }));
              UpdateLeaveDetails(leaveDetailsWithIds);
              updatLoading(false);
              setNotificationData((prev) => ({
                ...prev,
                coloe: SuccessColor,
                message: leaveDetailsResponseRes.Message,
                visibility: true,
              }));
            }
            else{
                updatLoading(false);
                setNotificationData((prev) => ({
                  ...prev,
                  coloe: DangerColor,
                  message: leaveDetailsResponseRes.Message,
                  visibility: true,
                }));
            }
        
      }
    catch (e) 
      {
        console.log("Error fetching Employee Leave Details:", e);
        updatLoading(false);
        setNotificationData((prev) => ({
          ...prev,
          coloe: DangerColor,
          message: "Unable to fetch leave details. Please try again.",
          visibility: true,
        }));
      }
  };

  const handleCloseNotification=()=>{
    setNotificationData((pre)=>({
      ...pre,
      visibility:false
    }))
  }

  const handlePDFDownload = () => {
    if (!generatePDF) {
      setGeneratePDF(true);
    }
  };

  useEffect(() => {
    
    if (generatePDF) {
      
      setGeneratePDF(false);
    }
  }, [generatePDF]);

  const handleExcelDownload=()=>{
    if(!generateExcel)
    {
      setGenerateExcel(true)
    }
  }

  useEffect(() => {
    
    if (generateExcel) {
      
      setGenerateExcel(false);
    }
  }, [generateExcel]);
      
    // Body
    const body=(
      <div>
        <Grid container sx={{flex:1}} >
          {/* Heading */}
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div>
              <h1 style={{color:ThemeColor.Color, fontFamily: 'emoji',fontSize: '2em',fontWeight: 'bold',}}>Leaves Details</h1>
            </div>
          </Grid>
          {/* Buttons */}
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div style={{
              display: 'flex',
              position: 'relative',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              gap:'8px',
            }}>
              <Button variant='contained'  
                        sx={{
                            backgroundColor:ThemeColor.Color,color: '#FFFFFF',
                            '&:hover': {
                                  backgroundColor:ThemeColor.Color,
                            },
                            textTransform: 'none',
                            fontFamily: 'Sans-serif',
                        }}
                        onClick={handlePDFDownload}  
                        startIcon={<PictureAsPdfIcon/>}
                      >Export PDF</Button>
                       <Button
                  variant="contained"
                  sx={{
                    backgroundColor: ThemeColor.Color,
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: ThemeColor.Color,
                    },
                    textTransform: 'none',
                    fontFamily: 'Sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onClick={handleExcelDownload}
                >
                  <img src={LogoImage} alt="Excel Icon" style={{ width: '17px', height: '17px' }} />
                  Export Excel
                </Button>
              <Button variant='contained' 
                 sx={{backgroundColor:ThemeColor.Color,color: '#FFFFFF',
                  '&:hover': {
                      backgroundColor:ThemeColor.Color,
                  },
                  textTransform: 'none',
                  fontFamily: 'Sans-serif',}} onClick={fetchEmployeeLeavesDetails} startIcon={<RefreshIcon/>}>Refresh</Button>
            </div>
          </Grid>

          {/* Loading Icon */}
          {loading && (
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <CircularProgress  style={{color:ThemeColor.Color }}/>
          </Grid>
          )}

          {/* Skills Table */}
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            {!loading && (
            <StyledDataGrid rows={leaveDetails} columns={columns}/>
            )}
          </Grid>  
          {/* <NotificationComponent backgroundColor={notificationColor} message={notificationMessage} onClose={() => setNotificationvisibility(false)} open={notificationvisibility}/> */}
          <NotificationComponent backgroundColor={notificationData.coloe} message={notificationData.message} onClose={handleCloseNotification} open={notificationData.visibility}/>
          {generatePDF && (
                <PDFGenerator
                    columns={columns}
                    empSkills={leaveDetails}
                    employeeName={leaveDetails.length > 0 ? leaveDetails[0].employeeName : profileData.employeeName}
                    employeeId={leaveDetails.length > 0 ? leaveDetails[0].employeeId :profileData.employeeID}
                    Heading={'Employee Leaves Details'}
                />
            )}    
            {generateExcel &&(
                <ConvertExcelFile 
                  data={leaveDetails} 
                  employeeId={leaveDetails.length > 0 ? leaveDetails[0].employeeId :profileData.employeeID}
                  employeeName={leaveDetails.length > 0 ? leaveDetails[0].employeeName : profileData.employeeName} 
                  DetailsName={"Leaves Details"}
                  columns={columns}
                  />   
              )} 
        </Grid>
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

export default LeavesDetails;
