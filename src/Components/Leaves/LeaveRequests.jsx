import { Button, ButtonGroup, Dialog, DialogActions, DialogContent,  DialogTitle, FormControl, Grid, IconButton, MenuItem, Select, TextareaAutosize, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { UpdateLeaveStatus, leaveRequestDetails } from '../../ProfileApiCalls/Leaves/LeavesApi';
import { Box } from '@mui/system';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Loader from '../Loader/Loader';
import TimerComponent from '../TimeOutComponent/TimeOut';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DangerColor, SuccessColor, ThemeColor } from '../ENV Values/envValues';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PDFGenerator from '../ConvertPDF/PDFGenerator';
import StyledDataGrid from '../TableCOmponent/Displaytable';
import { getProfileById } from '../../ProfileApiCalls/profile/Apicalls';
import Conformation from '../Conformation Component/Conformation';
import NotificationComponent from '../Notification/NotificationComponent';
import ConvertExcelFile from '../Convert Excel/convertExcelFile';
import LogoImage from '../../Components/Images/excel-3-xl.png';
function LeaveRequests() {
    const [loading,updatLoading]=useState(false)
    const isMobileOrMediumScreen = useMediaQuery((theme) => theme.breakpoints.down('sm') || theme.breakpoints.down('md') || theme.breakpoints.down('xs'));
    const [selectedLeaveBody, setSelectedLeaveBody] = React.useState('');
    const [open, setOpen] = useState(false);
    const [fullWidth, setFullWidth] = useState(true);
    const[name,setName]=useState('')
    const [requestLeaveDetails,UpdateLeaveRequests]=useState([])
    const [maxWidth, setMaxWidth] = useState('sm');
    const [designation,setDesignation]=useState('')
    const [userId,setuserID]=useState('');
    const [generatePDF, setGeneratePDF] = useState(false);
    const [confirmationData, setConfirmationData] = useState('');
    const [conformationvisibility,setConvformationvisibility]=useState(false)
    const [operationName,setOperationName]=useState('');
    const [uniqueNumber,setUniqnumber]=useState('');
    const [selectedDicision,SetSelectedDicision]=useState('');
    const [notificationVisibility,setNotificationVisibility]=useState(false);
    const [notificationColor,setNotificationColor]=useState('');
    const [notificationMessage,setNotificationMessage]=useState('');
    const [generateExcel,setGenerateExcel]=useState(false);
    // getting userid from local storage  and set to variable
    useEffect(()=>{ 
      const storedUserId = localStorage.getItem('userId');
      setuserID(storedUserId);
    },[])

    // fetching current employee details
    const getUserGetails=async()=>{
      if(userId)
      {
        try{
          const empDetails= await getProfileById(userId);
          setDesignation(empDetails.data.designation);
          setName(empDetails.data.employeeName);
        }
        catch(e)
        {
          console.log("Unable to fetching employee details in leave requests screen")
        }
      }
    }

    useEffect(()=>{
      if(userId)
        {
          getUserGetails();
        }
    },[userId])

    // Converting date formate as(DD-MM-YYYY)
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
  };

    // Declare colums
    const columns = [
      { field: 'employeeId', headerName: 'Employee ID', width: 100 },
      { field: 'employeeName', headerName: 'Employee Name', width: 165 },
      { field: 'leaveType', headerName: 'Leave Type', width: 130 },
      { field: 'noOfDaysLeave', headerName: 'No Of Days', width: 100 },
      { field: 'leaveFromDate', headerName: 'Leave From Date', width:140 ,valueFormatter: (params) => formatDate(params.value) ? formatDate(params.value):''},
      { field: 'leaveToDate', headerName: 'Leave To Date', width: 120,valueFormatter: (params) => formatDate(params.value) ?formatDate(params.value):'' },
      {
        field: 'leaveBody',
        headerName: 'Leave Description',
        width: 160,
        renderCell: (params) => (
          <div>
            <IconButton onClick={() => handleSeeIconClick(params.row.leaveBody)}>
              <VisibilityIcon style={{color:ThemeColor.Color }} />
            </IconButton>
            {params.row.leaveBody}
          </div>
        ),
      },
      { field: 'leaveAppliedDate', headerName: 'Applied On', width: 125,valueFormatter: (params) => formatDate(params.value)},
      {
        field: 'Dicision',
        headerName: 'Dicision',
        width: 112,
        renderCell: (params) => (
          <Select
            style={{ width: "100%" }}
            placeholder='Pending'
            displayEmpty
            value={params.row.selectedDecision || ''} 
            onChange={(event) => handleDecisionChange(event, params)}
          >
            <MenuItem value="" disabled>Pending</MenuItem>
            <MenuItem value="Approved">Approve</MenuItem>
            <MenuItem value="Rejected">Reject</MenuItem>
          </Select>
        ),
        
      },
    ];

    // See icon click function
    const handleSeeIconClick = (leaveBody) => {
      setSelectedLeaveBody(leaveBody);
      setOpen(true);
    };

    // Dicision field Onchange function
    const handleDecisionChange =async (event, params) => {
      const selectedDecision = event.target.value;
      const selectedRowData = params.row;
      setUniqnumber(selectedRowData.uniqueNumber);
      SetSelectedDicision(selectedDecision)
      setOperationName("Change LeaveStatus");
      setConfirmationData(`Are you sure you want to ${selectedDecision} Leave Request \n Leave Type : ${selectedRowData.leaveType} \nEmployee ID : ${selectedRowData.employeeId}\n Employee Name : ${selectedRowData.employeeName}\n No Of Days leave : ${selectedRowData.noOfDaysLeave}\n Leave From Date :${selectedRowData.leaveFromDate}\n Leave To Date : ${selectedRowData.leaveToDate}`)
      setConvformationvisibility(true);
    };

    //If  designation is manager,team lead ..... then fetching leave request details
    useEffect(()=>{
      if(designation === 'Manager' || designation === 'Project Manager' || designation === 'Technical Lead' || designation === 'Vice President' || designation === 'Assistant Vice President')
        {
          fetchLeaveRequests();
        }
    },[designation])

    // fetching Leave Requests
    const fetchLeaveRequests = async () => {
      try 
        {
          updatLoading(true)
          const leaveDetailsRes = await leaveRequestDetails(name);
          // console.log(" employees Leave requests MS API result : ",leaveDetailsRes)
          if(leaveDetailsRes && leaveDetailsRes.Status==="FOUND")
          {
            const leaveDetails=leaveDetailsRes.data;
            const leaveDetailsWithIds = leaveDetails.map((row, index) => ({ ...row, id: index + 1 }));
            UpdateLeaveRequests(leaveDetailsWithIds);
            updatLoading(false);
            setNotificationColor(SuccessColor);
            setNotificationMessage(leaveDetailsRes.Message);
            setNotificationVisibility(true);
          }
          else
          {
            updatLoading(false);
            setNotificationColor(DangerColor);
            setNotificationMessage(leaveDetailsRes.Message);
            setNotificationVisibility(true);
          }
          
        } 
      catch (e) 
        {
          console.log("Error fetching Employee Leave Details:", e);
          updatLoading(false);
          setNotificationColor(DangerColor);
          setNotificationMessage('Unable to fetch leave request details. Please try again.');
          setNotificationVisibility(true);
        }
    };

     // Function for close popup
    const handleClose = () => {
      setOpen(false);
    };

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

    const handleExcelDownload = () => {
      if (!generateExcel) {
        setGenerateExcel(true);
      }
    };
  
    useEffect(() => {
      
      if (generateExcel) {
        
        setGenerateExcel(false);
      }
    }, [generateExcel]);

    const handleConfirmationAction =async(result) => {
      if(result==='ok')
      {
        if(operationName==='Change LeaveStatus')
        {
          try
                {
                  updatLoading(true)
                  const res=await UpdateLeaveStatus(uniqueNumber,selectedDicision) ;
                  console.log("Update leave request MS API result : ",res);
                  if(res && res.Status==="OK")
                  {
                    const leaveDetails = await leaveRequestDetails(name);
                    const leaveDetailsWithIds = leaveDetails.data.map((row, index) => ({ ...row, id: index + 1 }));
                    UpdateLeaveRequests(leaveDetailsWithIds);
                    updatLoading(false);   
                    setNotificationColor(SuccessColor);
                    setNotificationMessage(res.Message);
                    setNotificationVisibility(true);
                  }
                  else
                  {
                    updatLoading(false);   
                    setNotificationColor(DangerColor);
                    setNotificationMessage(res.Message);
                    setNotificationVisibility(true);
                  }
                  
               }
              catch(e)
               {
                  updatLoading(false);
                  setNotificationColor(DangerColor);
                  setNotificationMessage("Unable to update leave status. ");
                  setNotificationVisibility(true);               
               }
        }
        else{
          // params.api.updateRows([{ id: seletedRowId.id, changes: { Dicision: '' } }]);
        }
  
      }
    };

    const body=(
        <div>
          <Grid container sx={{flex:1}} >
            {/* Heading */}
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div>
                <h1 style={{color:ThemeColor.Color, fontFamily: 'emoji',fontSize: '2em',fontWeight: 'bold',}}>Leave Requests</h1>
              </div>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div style={{
                display: 'flex',
                position: 'relative',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                gap:'8px',
                }}
              >
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
                  Export Excel</Button>


                <Button variant='contained'  sx={{backgroundColor:ThemeColor.Color,color: '#FFFFFF',
                     '&:hover': {
                         backgroundColor:ThemeColor.Color,
                      },
                      textTransform: 'none',
                      fontFamily: 'Sans-serif',}} onClick={fetchLeaveRequests} startIcon={<RefreshIcon/>}
                >Refresh</Button>
              </div>
            </Grid>

            {/* Skills Table */}
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              {!loading && (
                <StyledDataGrid rows={requestLeaveDetails} columns={columns} />
              )}
            </Grid>

            {/* Update About PopUp Grid */}
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Dialog fullWidth={fullWidth}  maxWidth={maxWidth} open={open}   >
                <DialogTitle>Leave Description</DialogTitle>
                  <DialogContent>
                    <Box
                      noValidate
                      component="form"
                      sx={{ display: 'flex', flexDirection: 'column', m: 'auto' }}
                    >
                        <FormControl sx={{ mt: 2, minWidth: 200 }}>
                          <TextareaAutosize
                            id="about"
                            aria-label="About Me"
                            placeholder="Enter your email message here"
                            rowsMin={5}
                            style={{ width: '100%', resize: 'vertical' }}
                            value={selectedLeaveBody}  
                          />
                        </FormControl>
                    </Box>
                  </DialogContent>
                <DialogActions>
                <ButtonGroup variant="contained">
                  <Button  onClick={handleClose} style={{backgroundColor:"#E93445",color:"white"}}>Close</Button>

                </ButtonGroup>
                </DialogActions>
              </Dialog>
            </Grid>   
            <NotificationComponent backgroundColor={notificationColor} message={notificationMessage} onClose={()=>{setNotificationVisibility(false)}} open={notificationVisibility}/>
            <Conformation open={conformationvisibility} onClose={() => setConvformationvisibility(false)}  onAction={handleConfirmationAction}  data={confirmationData} />
            {generatePDF && (
                <PDFGenerator
                    columns={columns}
                    empSkills={requestLeaveDetails}
                    employeeName={name  ? name : ''}
                    employeeId={userId ? userId : ''}
                    Heading={'Employees Leave Requests'}
                />
            )}   
            {generateExcel &&(
                <ConvertExcelFile 
                  data={requestLeaveDetails} 
                  employeeId={name  ? name : ''}
                  employeeName={userId ? userId : ''} 
                  DetailsName={"Employees Leave Requests"}
                  columns={columns}
                  />   
              )} 
          </Grid>
          <TimerComponent/>
        </div>
    )

    
  return (
          <div >
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

export default LeaveRequests;
