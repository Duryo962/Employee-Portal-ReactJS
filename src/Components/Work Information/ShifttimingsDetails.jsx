import { Button, Checkbox, Dialog, DialogTitle, FormControl, FormControlLabel, Grid, List,  ListItem, TextField, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Loader from '../Loader/Loader';
import { DangerColor, SuccessColor, ThemeColor } from '../ENV Values/envValues';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import StyledDataGrid from '../TableCOmponent/Displaytable';
import NotificationComponent from '../Notification/NotificationComponent';
import { deleteShiftimings, getShiftTimingsByEmployeeId, insertShiftimings, updateShiftimings } from '../../ProfileApiCalls/WorkInformationApiCalls/ShiftTimingsApi';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { getProfileById } from '../../ProfileApiCalls/profile/Apicalls';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Confirmation from '../Conformation Component/Conformation';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import dayjs from 'dayjs';
import PDFGenerator from '../ConvertPDF/PDFGenerator';
import SendIcon from '@mui/icons-material/Send';
import UpdateIcon from '@mui/icons-material/Update';
import CancelIcon from '@mui/icons-material/Cancel';
import ConvertExcelFile from '../Convert Excel/convertExcelFile';
import LogoImage from '../../Components/Images/excel-3-xl.png';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
function ShifttimingsDetails() {
    const isMobileScreen=useMediaQuery((theme)=>theme.breakpoints.down('sm') || theme.breakpoints.down('md') || theme.breakpoints.down('xs'));
    const [loading,setLoading]=useState(false);
    const [userId,setUserId]=useState('');
    const [shiftData,setShiftData]=useState([]);
    const [createShiftVisibiity,setCreateShiftVisibility]=useState(false)
    const [notificationData,setNotificationData]=useState({
        color:'',
        message:'',
        visivility:'',
    })
    const [operationName,setOperationName]=useState('')
    const [conformationData,setCOnformationData]=useState({
        data:'',
        visibility:false
    })
    const [dialogBoxVisibility,setDialogBoxVisibility]=useState(false);
    const [toHours, setToHours] = useState(0);
    const [toMinutes, setToMinutes] = useState(0);
    const [fromHours, setFromHours] = useState(0);
    const [fromMinutes, setFromMinutes] = useState(0);
    const [selectedRowToHour,setSelectedRowToHour]=useState(0);
    const [selectedRowToMinutes,setSelectedRowToMinutes]=useState(0);
    const [selectedRowFromHour,setSelectedRowFromHour]=useState(0);
    const [selectedRowFromMinutes,setSelectedRowFromMinutes]=useState(0);
    const [shiftTimingsData,setShiftTimingData]=useState({
        employeeName:'',
        employeeId:'',
        startDate:null,
        endDate:null,
        shiftStartTime:'',
        shiftEndTime:'',
        weekOffDays:'',
        modifiedBy:'',
        modifiedDate:new Date(),
    })
    const [SeletedRowData,setSelectedRowData]=useState({
        employeeName:'',
        employeeId:'',
        startDate:null,
        endDate:null,
        shiftStartTime:'',
        shiftEndTime:'',
        weekOffDays:'',
        modifiedBy:'',
        modifiedDate:new Date(),
    })
    const [errorMessage,setErrorMessage]=useState({
        weekOffDays:'',
        startDate:'',
        startTime:'',
        endtime:'',
    })
    const [selectedRowId,setSelectedRowId]=useState('')
    const [selectedDays, setSelectedDays] = useState([]);
    const [SelectedRowDays,setSelectedRowDays]=useState([])   
    let formattedToTime = `${toHours}:${toMinutes}`;
    let formattedFromTime=`${fromHours}:${fromMinutes}`;
    let SelectedRowFormattedToTime=`${selectedRowToHour}:${selectedRowToMinutes}`;
    let SelectedRowFormattedFromTime=`${selectedRowFromHour}:${selectedRowFromMinutes}`
    const [generatePDF,setgeneratePDF]=useState(false);
    const [generateExcel,setGenerateExcel]=useState(false);
    const [selectedDeletedRowId,setSlectedDeletedRowId]=useState("")    
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

    useEffect(()=>{
        setShiftTimingData((pre)=>({
            ...pre,
            shiftStartTime:formattedFromTime,
        }))
    },[formattedFromTime])

    useEffect(()=>{
        setShiftTimingData((pre)=>({
            ...pre,
            shiftEndTime:formattedToTime,
        }))
    },[formattedToTime])

    useEffect(()=>{ setSelectedRowData((pre)=>({...pre,shiftEndTime:SelectedRowFormattedToTime}))},[SelectedRowFormattedToTime])
    
    useEffect(()=>{ setSelectedRowData((pre)=>({...pre,shiftStartTime:SelectedRowFormattedFromTime}))},[SelectedRowFormattedFromTime])

    useEffect(()=>{
        const userId=localStorage.getItem('userId');
        setUserId(userId);
    },[])

    useEffect(()=>{
        if(userId)
        {
            fetchingShiftTimings();
            currentUserData();
        }
    },[userId])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const currentUserData=async()=>{
        try{
            const employeeData=await getProfileById(userId);
            UpdateProfileData(employeeData.data);
            setShiftTimingData((pre)=>({
                ...pre,
                employeeId:userId,
                employeeName:employeeData.employeeName,
                modifiedBy:userId+' - '+employeeData.data.employeeName,
            }))
            setSelectedRowData((pre)=>({
                ...pre,
                modifiedBy:userId+" - "+employeeData.employeeName,
            }))
        }
        catch(e)
        {
                console.log("Unable to fetching current user Data")
        }
    }

    const fetchingShiftTimings=async()=>{
        try{
            if(createShiftVisibiity===false)
            {
                setLoading(true);
                const shiftDetails=await getShiftTimingsByEmployeeId(userId);
                // console.log("Current employee shift timings data MS API result : ",shiftDetails)
                if(shiftDetails && shiftDetails.Status==="OK")
                {
                    setShiftData(shiftDetails.data);
                    setLoading(false);
                    setNotificationData((pre)=>({
                        ...pre,
                        color:SuccessColor,
                        message:shiftDetails.Message,
                        visivility:true,
                    }))
                }
                else
                {
                    setLoading(false);
                    setNotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        message:shiftDetails.Message,
                        visivility:true,
                    }))
                }
            }
        }
        catch(e)
        {
            setLoading(false);
            setNotificationData((pre)=>({
                ...pre,
                color:DangerColor,
                message:"Unable to Fetching Shift Details",
                visivility:true,
            }))
        }

    }

    const handleDeleteClick=async(rowData)=>{
        setSlectedDeletedRowId(rowData.id)
        setOperationName("Delete Shift")
        const fromDate =rowData.startDate ? dayjs(rowData.startDate).format('DD-MM-YYYY'):'Null';
        const toDate =rowData.endDate ? dayjs(rowData.endDate).format('DD-MM-YYYY'):'Null';
        const conformationData=`Are you sure you want to delete Shift Timings\nWeek Off Days :${rowData.weekOffDays}\nStart Date :${fromDate}\nEnd Date :${toDate}\nShift From Time :${rowData.shiftStartTime}\nShift End Time :${rowData.shiftEndTime}`;
        setCOnformationData((pre)=>({
            ...pre,
            data:conformationData,
            visibility:true,
        }))

    }
    
    const columns=[
        {field:'startDate',headerName:'Start Date',width:120, valueFormatter: (params) => params.value ? formatDate(params.value) : ''},
        {field:'endDate',headerName:"End Date",width:120, valueFormatter: (params) => params.value ? formatDate(params.value) : ''},
        {field:'shiftStartTime',headerName:'Shift Start Time',width:130,},
        {field:'shiftEndTime',headerName:'Shift End Time',width:130, },
        {field:'weekOffDays',headerName:'Week Days',width:160},
        {field:'modifiedBy',headerName:'Modified By',width:220},
        {field:'modifiedDate',headerName:'Modified Date',width:140, valueFormatter: (params) => params.value ? formatDate(params.value) : ''},
        {
            field: 'edit',
            headerName: "Edit",
            width: 65,
            renderCell: (params) => (
                <EditIcon 
                    sx={{ color: ThemeColor.Color }}
                  onClick={() => handleEditClick(params.row)}
                />
            )
        },
        {
            field: 'delete',
            headerName: "Delete",
            width: 65,
            renderCell: (params) => (
                <DeleteForeverIcon 
                    sx={{ color: ThemeColor.Color }}
                  onClick={() => handleDeleteClick(params.row)}
                />
            )
        }
    ]

    const handleEditClick=(params)=>{

        setSelectedRowId(params.id)
        const weekoffdaysArray=params.weekOffDays.split(', ');
        setSelectedRowDays(weekoffdaysArray);
        const [extractedFromHours, extractedFromMinutes] = params.shiftStartTime.split(':');
        const [extractedToHours, extractedToMinutes] = params.shiftEndTime.split(':');
        setSelectedRowFromHour(extractedFromHours);
        setSelectedRowFromMinutes(extractedFromMinutes);
        setSelectedRowToHour(extractedToHours);
        setSelectedRowToMinutes(extractedToMinutes);
        setSelectedRowData((pre)=>({
            ...pre,
            employeeId:params.employeeId,
            employeeName:params.employeeName,
            endDate: params.endDate ? dayjs(params.endDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ') : null,
            modifiedDate:new Date(),
            startDate:params.startDate ? dayjs(params.startDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ') : null,

        }))
        setDialogBoxVisibility(true)
    }

    useEffect(()=>{
        setShiftTimingData((pre)=>({
            ...pre,
            weekOffDays:selectedDays.join(', '),
        }))
    },[selectedDays])

    useEffect(()=>{
        setSelectedRowData((pre)=>({
            ...pre,
            weekOffDays:SelectedRowDays.join(', '),
        }))
    },[SelectedRowDays])

    useEffect(() => {
    
        if (generatePDF) {
          
          setgeneratePDF(false);
        }
    }, [generatePDF]);

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
          setSelectedDays([...selectedDays, value]);
        } else {
          setSelectedDays(selectedDays.filter(day => day !== value));
        }
    };

    const handleToHoursChange = (event) => {
        const { value } = event.target;
        if (value >= 0 && value <= 24) {
            setToHours(value);
        }
    };

    const handleToMinutesChange = (event) => {
        const { value } = event.target;
        if (value >= 0 && value <= 60) {
            setToMinutes(value);
        }
    };

    const handleFromHoursChange = (event) => {
        const { value } = event.target;
        if (value >= 0 && value <= 24) {
            setFromHours(value);
        }
    };

    const handleFromMinutesChange = (event) => {
        const { value } = event.target;
        if (value >= 0 && value <= 60) {
            setFromMinutes(value);
        }
    };

    function validation(){
        let isValid=true;
        // weekOff Days Validation
        if(!shiftTimingsData.weekOffDays)
        {
            setErrorMessage((pre)=>({
                ...pre,
                weekOffDays:"Select WeekOff Days",
            }))
            isValid=false;
        }
        else
        {
            setErrorMessage((pre)=>({
                ...pre,
                weekOffDays:'',
            }))   
        }

        // Start Date Validation
        if(!shiftTimingsData.startDate)
        {
            setErrorMessage((pre)=>({
                ...pre,
                startDate:"Please Select Start Date",
            }));
            isValid=false;
        }
        else
        {
            setErrorMessage((pre)=>({
                ...pre,
                startDate:'',
            }));
        }

        // Start Time Validation
        if(shiftTimingsData.shiftStartTime ==='0:0')
        {
            setErrorMessage((pre)=>({
                ...pre,
                startTime:"Please Enter Start Time",
            }));
            isValid=false;
        }
        else
        {
            setErrorMessage((pre)=>({
                ...pre,
                startTime:"",
            }));
        }

        // End Time Validation
        if(shiftTimingsData.shiftEndTime==='0:0')
        {
            setErrorMessage((pre)=>({
                ...pre,
                endtime:"Please Enter End time",
            }));
            isValid=false;
        }
        else
        {
            setErrorMessage((pre)=>({
                ...pre,
                endtime:"",
            }));
        }
        return isValid;
    }

    const handleBackButton=()=>{
        setErrorMessage((pre)=>({
            ...pre,
            endtime:'',
            startDate:'',
            startTime:'',
            weekOffDays:'',
        }));
        setShiftTimingData((pre)=>({
            ...pre,
            endDate:null,
            shiftEndTime:'',
            startDate:null,
            weekOffDays:'',
            shiftStartTime:'',
        }));
        setSelectedDays([]);
        setCreateShiftVisibility(false);
    }

    const insertShiftDetails= async()=>{
        const Validationresult=validation();
        if(Validationresult===true)
        {
            const startDate =shiftTimingsData.startDate ? dayjs(shiftTimingsData.startDate).format('DD-MM-YYYY'):null;
            const endDate = shiftTimingsData.endDate ? dayjs(shiftTimingsData.endDate).format('DD-MM-YYYY') : null;
            setOperationName('Create Shift')
            const confirmation=`Are you sure you want to Create Skill\nWeek Off Days : ${shiftTimingsData.weekOffDays}\nShift Start Date: ${startDate}\nShift End Date :${endDate}\nShift Time From :${shiftTimingsData.shiftStartTime}\nShift Time To : ${shiftTimingsData.shiftEndTime}`;
            setCOnformationData((pre)=>({
                ...pre,
                data:confirmation,
                visibility:true,
            }))
        }
    }

    const handleConfirmationAction =async(result) => {
        if(result==='ok')
        {
            if(operationName ==='Create Shift')
            {
                try{
                    setLoading(true);
                    const result=await insertShiftimings(shiftTimingsData);
                    // console.log("Create shift timings MS API result : ",result);
                    if(result && result.Status==="OK")
                    {
                        setLoading(false);
                        setNotificationData((pre)=>({
                            ...pre,
                            color:SuccessColor,
                            message:result.Message,
                            visivility:true,
                        }))
                        setShiftTimingData((pre)=>({
                            ...pre,
                            endDate:null,
                            shiftEndTime:'',
                            startDate:null,
                            weekOffDays:'',
                            shiftStartTime:'',
                        }))
                        setFromHours('');
                        setFromMinutes('');
                        setToHours('');
                        setToMinutes('');
                        setSelectedDays([]);
                    }
                    else
                    {
                        setLoading(false);
                        setNotificationData((pre)=>({
                            ...pre,
                            color:DangerColor,
                            message:result.Message,
                            visivility:true,
                        }))
                    }
                }
               catch(e)
               {
                    setLoading(false);
                    setNotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        message:"Unable to insert Shift Timings please Try again",
                        visivility:true,
                    }))
               } 

            }
            else if(operationName==='Update Shift')
            {
                try{
                    setLoading(true);
                    const updateResult=await updateShiftimings(selectedRowId,SeletedRowData);
                    if(updateResult && updateResult.Status==="OK")
                    {
                        fetchingShiftTimings();
                        // console.log("Update shift timings MS API result : ",updateResult);
                        setLoading(false);
                        setDialogBoxVisibility(false);
                        setNotificationData((pre)=>({
                            ...pre,
                            color:SuccessColor,
                            message:updateResult.Message,
                            visivility:true,
                        }))
                        setSelectedDays([]);
                    }
                    else
                    {
                        setLoading(false);
                        setDialogBoxVisibility(false);
                        setNotificationData((pre)=>({
                            ...pre,
                            color:DangerColor,
                            message:updateResult.Message,
                            visivility:true,
                        }))
                    }
                }
                catch(e){
                    setNotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        message:"Unable to updating shift timings.Please try again.",
                        visivility:true,
                    }))

                }
            }
            else if(operationName==='Delete Shift')
            {
                try{
                    if(selectedDeletedRowId)
                    {
                        setLoading(true);
                        const deleteShiftResult=await deleteShiftimings(selectedDeletedRowId);
                        if(deleteShiftResult && deleteShiftResult.Status==="OK")
                        {
                            fetchingShiftTimings();
                            // console.log("Delete shift timings MS API result : ",deleteShiftResult);
                            setLoading(false);
                            setNotificationData((pre)=>({
                                ...pre,
                                color:SuccessColor,
                                message:deleteShiftResult.Message,
                                visivility:true,
                            }))
                        }
                        else
                        {
                            setLoading(false);
                            setNotificationData((pre)=>({
                                ...pre,
                                color:DangerColor,
                                message:deleteShiftResult.Message,
                                visivility:true,
                            }))
                        }
                    }
                }
                catch(e){
                    setNotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        message:"Unable to delete shift timings.Please try again.",
                        visivility:true,
                    }))

                }
            }

        }
    }

    const handleSelectedFromHoursChange=(event)=>{
        const { value } = event.target;
        if (value >= 0 && value <= 24) {
            setSelectedRowFromHour(value);
        }
    }
    const handleSelectedFromMinutesChange=(event)=>{
        const { value } = event.target;
        if (value >= 0 && value <= 60) {
            setSelectedRowFromMinutes(value);
        }
    }

    const handleSelectedToHoursChange=(event)=>{
        const { value } = event.target;
        if (value >= 0 && value <= 24) {
            setSelectedRowToHour(value);
        }
    }
    const handleSelectedToMinutesChange=(event)=>{
        const { value } = event.target;
        if (value >= 0 && value <= 60) {
            setSelectedRowToMinutes(value);
        }
    }

    const updateselectedRow=async()=>{
        setOperationName("Update Shift")
        const fromDate =SeletedRowData.startDate ? dayjs(SeletedRowData.startDate).format('DD-MM-YYYY'):'Null';
        const toDate =SeletedRowData.endDate ? dayjs(SeletedRowData.endDate).format('DD-MM-YYYY'):'Null';
        const conformationData=`Are you sure you want to Update Shift Timings\nWeek Off Days :${SeletedRowData.weekOffDays}\nStart Date :${fromDate}\nEnd Date :${toDate}\nShift From Time :${SeletedRowData.shiftStartTime}\nShift End Time :${SeletedRowData.shiftEndTime}`;
        setCOnformationData((pre)=>({
            ...pre,
            data:conformationData,
            visibility:true,
        }))
    }

    const handleSelectedCheckboxChange=(event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedRowDays([...SelectedRowDays, value]);
        } else {
            setSelectedRowDays(SelectedRowDays.filter(day => day !== value));
        }
    };

    const handleDialogCloseButton=()=>{
        setSelectedRowData((pre)=>({
            ...pre,
            employeeId:'',
            employeeName:'',
            endDate:null,
            shiftEndTime:'',
            shiftStartTime:'',
            startDate:null,
            weekOffDays:'',
        }))
        setDialogBoxVisibility(false);
    }

    const handleGeneratePdfFile=()=>{
        if (!generatePDF) {
            setgeneratePDF(true);
          }
    }

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

    const body=(
        <>
        <Grid container  spacing={0.5} sx={{flex: 1}}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container spacing={0.5}>
                    {
                        createShiftVisibiity ? 
                        //  Create Shift Timings Screen
                    <>
                        {/* Heading */}
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ textAlign: 'center', flex: '1' }}>
                                    <h1 style={{ color: ThemeColor.Color, fontFamily: 'emoji', fontSize: '1.8em', fontWeight: 'bold', }}>Create Shift Timings</h1>
                                </div>
                                <div style={{ marginLeft: 'auto' }}>
                                    <Button variant='contained' startIcon={<ArrowBackIosIcon/>} sx={{backgroundColor:ThemeColor.Color,
                                        color:'#FFFF',
                                        textTransform:'none',
                                        '&:hover':{
                                            backgroundColor:ThemeColor.Color,
                                        }}}
                                        onClick={handleBackButton}
                                    >Back</Button>
                                </div>
                            </div>           
                        </Grid>

                        {/* Horizontal Line */}
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <hr style={{ background: ThemeColor.Color , color: ThemeColor.Color , borderColor: ThemeColor.Color , height: '3px', maxWidth: "100%", width: "90%" ,top:'10px'}}/>
                        </Grid>

                        {/* Days Display */}
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div>
                                <div>
                                    <Typography variant='p' sx={{color:ThemeColor.Color,fontSize:'17px',fontWeight:'bold'}}> Select Week Off Days</Typography>
                                </div>
                                <div>
                                    <FormControlLabel control={<Checkbox onChange={handleCheckboxChange} value="Monday" />}label="Mon"/>
                                    <FormControlLabel control={<Checkbox onChange={handleCheckboxChange} value="Tuesday" />}label="Tue"/>
                                    <FormControlLabel control={<Checkbox onChange={handleCheckboxChange} value="Wednesday" />} label="Wed"/>
                                    <FormControlLabel control={<Checkbox onChange={handleCheckboxChange} value="Thursday" />} label="Thu"/>
                                    <FormControlLabel control={<Checkbox onChange={handleCheckboxChange} value="Friday" />} label="Fri"/>
                                    <FormControlLabel control={<Checkbox onChange={handleCheckboxChange} value="Saturday" />}label="Sat"/>
                                    <FormControlLabel  control={<Checkbox onChange={handleCheckboxChange} value="Sunday" />} label="Sun"/>
                                </div>
                            </div>
                        </Grid>

                        {/* From Date */}
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                          <div style={{display:'flex',width:"100%" ,position:'relative',alignItems:'center',justifyContent:'center'}}>
                            <FormControl style={{ width: isMobileScreen ? "60%" : "50%", height: "100%" }} >
                                <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker label="Start Date"  sx={{width:'100%'}}
                                            value={shiftTimingsData.startDate}
                                            onChange={(date) => {
                                                setShiftTimingData((pre) => ({ ...pre, startDate: date }));  
                                            }}
                                        />
                                    </DemoContainer>          
                                </LocalizationProvider>
                            </FormControl>
                          </div>
                        </Grid>

                        {/* To Date */}
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                            <div style={{display:'flex',width:"100%" ,position:'relative',alignItems:'center',justifyContent:'center'}}>
                                <FormControl style={{ width: isMobileScreen ? "60%" : "50%", height: "100%" }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker label="End Date"  sx={{width:'100%'}}
                                              value={shiftTimingsData.endDate}
                                              onChange={(date) => {
                                                setShiftTimingData((pre) => ({ ...pre, endDate: date }));  
                                              }}
                                            />
                                        </DemoContainer>          
                                    </LocalizationProvider>
                                </FormControl>
                            </div>
                                
                        </Grid>          
                        
                        {/* Timing From */}
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div style={{display:'flex',width:"100%" ,position:'relative',alignItems:'center',justifyContent:'center'}}>
                                <Typography variant='p' style={{fontWeight:'bold',color:ThemeColor.Color}}> ShiftTime From</Typography>
                                <TextField type='number' label="Hours" id="outlined-start-adornment" sx={{ m: 1,width: '25ch'}}inputProps={{ min: 0, max: 24 }} onChange={handleFromHoursChange}
                                />:
                                <TextField  type='number' label="Minutes" id="outlined-start-adornment" sx={{ m: 1, width: '25ch' }}inputProps={{ min: 0, max: 60 }}onChange={handleFromMinutesChange}
                                />
                            </div>
                        </Grid>

                        {/* Timing to  */}
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div style={{display:'flex',width:"100%" ,position:'relative',alignItems:'center',justifyContent:'center'}}>
                                <Typography variant='p' style={{fontWeight:'bold',color:ThemeColor.Color}}> ShiftTime To</Typography>
                                <TextField type='number' label="Hours" id="outlined-start-adornment" sx={{ m: 1,width: '25ch'}} inputProps={{ min: 0, max: 24 }} onChange={handleToHoursChange}
                                />:
                                <TextField type='number' label="Minutes" id="outlined-start-adornment" sx={{ m: 1, width: '25ch' }} inputProps={{ min: 0, max: 60 }}onChange={handleToMinutesChange}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <FormControl style={{ width: "90%", height: "6%" }} >
                                <p style={{color:'#FF0000',fontSize:"15px",fontWeight:'bold'}}>{errorMessage.weekOffDays ? errorMessage.weekOffDays + (errorMessage.weekOffDays ? ',' : '') : ''}{errorMessage.startDate? errorMessage.startDate + (errorMessage.startDate ? ',' : '') : ''}{errorMessage.startTime ? errorMessage.startTime+ (errorMessage.startTime ? ',' : '') : ''}{errorMessage.endtime ? errorMessage.endtime + (errorMessage.endtime ? ',' : '') : ''}</p>
                            </FormControl>
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Button variant='contained'
                                sx={{
                                    backgroundColor:ThemeColor.Color,
                                    color:'#FFFF',
                                    '&:hover':{
                                        backgroundColor:ThemeColor.Color
                                    },
                                    textTransform:'none'
                                }}    
                                size='medium'
                                onClick={insertShiftDetails}
                                endIcon={<SendIcon/>}
                            >Create Shift</Button>
                        </Grid>     
                    </>
                        :
                        // Display Shift Details Table with heading and buttons
                    <>  
                        {/* Heading */}
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <h1 style={{color:ThemeColor.Color, fontFamily: 'emoji',fontSize: '2em',fontWeight: 'bold',}}>Shift Timings</h1>
                        </Grid>
                        
                        {/* Refresh and create buttons */}
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div style={{display:'flex',gap:'10px',position:'relative',alignItems:'center', justifyContent:'flex-end'}}>
                                <Button variant='contained'  
                                    sx={{
                                        backgroundColor:ThemeColor.Color,color: '#FFFFFF',
                                        '&:hover': {
                                            backgroundColor:ThemeColor.Color,
                                        },
                                        textTransform: 'none',
                                        fontFamily: 'Sans-serif',
                                    }}
                                    onClick={handleGeneratePdfFile}  
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

                                <Button variant='contained' startIcon={<RefreshIcon/>} sx={{
                                    backgroundColor:ThemeColor.Color,
                                    color:'#FFFF',
                                    '&:hover':{
                                        backgroundColor:ThemeColor.Color
                                    },
                                    textTransform:'none'
                                    }}
                                    onClick={fetchingShiftTimings}
                                >Refresh</Button>

                                <Button variant='contained' startIcon={<AddBoxIcon/>} sx={{
                                    backgroundColor:ThemeColor.Color,
                                    color:'#FFFF',
                                    '&:hover':{
                                        backgroundColor:ThemeColor.Color,
                                    },
                                    textTransform:'none'
                                    }}
                                    onClick={()=>{setCreateShiftVisibility(true)}}
                                >Create Shift</Button>
                            </div>
                        </Grid>

                        {/* Shift Details Table */}
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <StyledDataGrid columns={columns}  rows={shiftData || []}/>
                        </Grid>

                        {/* Dialog  Box for Display selected row data */}
                        <Dialog open={dialogBoxVisibility}>
                            <DialogTitle style={{color: ThemeColor.Color, fontFamily: 'emoji', fontSize: '1.5em', fontWeight: 'bold', textAlign: 'center', flex: '1' }}>Edit Shift Timings</DialogTitle>
                            <List>
                                {/* WeekDays */}
                                <ListItem>
                                    <div>
                                        <div>
                                            <Typography variant='p' sx={{color:ThemeColor.Color,fontSize:'16px',fontWeight:'bold'}}> Select Week Off Days</Typography>
                                        </div>
                                        <div>
                                            <FormControlLabel control={<Checkbox onChange={handleSelectedCheckboxChange} value="Monday" checked={SelectedRowDays.includes("Monday")}/>}label="Mon"/>
                                            <FormControlLabel control={<Checkbox onChange={handleSelectedCheckboxChange} value="Tuesday" checked={SelectedRowDays.includes("Tuesday")}/>}label="Tue"/>
                                            <FormControlLabel control={<Checkbox onChange={handleSelectedCheckboxChange} value="Wednesday" checked={SelectedRowDays.includes("Wednesday")}/>} label="Wed"/>
                                            <FormControlLabel control={<Checkbox onChange={handleSelectedCheckboxChange} value="Thursday" checked={SelectedRowDays.includes("Thursday")}/>} label="Thu"/>
                                            <FormControlLabel control={<Checkbox onChange={handleSelectedCheckboxChange} value="Friday" checked={SelectedRowDays.includes("Friday")}/>} label="Fri"/>
                                            <FormControlLabel control={<Checkbox onChange={handleSelectedCheckboxChange} value="Saturday" checked={SelectedRowDays.includes("Saturday")}/>}label="Sat"/>
                                            <FormControlLabel  control={<Checkbox onChange={handleSelectedCheckboxChange} value="Sunday"  checked={SelectedRowDays.includes("Sunday")}/>} label="Sun"/>
                                        </div>
                                    </div>
                                </ListItem>

                                {/* Start Date */}
                                <ListItem>
                                    <div style={{display:'flex',width:"100%" ,position:'relative',alignItems:'center',justifyContent:'center'}}>
                                        <FormControl style={{ width: isMobileScreen ? "70%" : "50%", height: "100%" }} >
                                            <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                                                <DemoContainer components={['DatePicker']}>
                                                    <DatePicker label="Start Date"  sx={{width:'100%'}}
                                                        value={SeletedRowData.startDate}
                                                        onChange={(date) => {
                                                            setSelectedRowData((pre) => ({ ...pre, startDate: date }));  
                                                        }}
                                                    />
                                                </DemoContainer>          
                                            </LocalizationProvider>
                                        </FormControl>
                                    </div>
                                </ListItem>

                                {/* End Date */}
                                <ListItem>
                                    <div style={{display:'flex',width:"100%" ,position:'relative',alignItems:'center',justifyContent:'center'}}>
                                    <FormControl style={{ width: isMobileScreen ? "70%" : "50%", height: "100%" }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                                                <DemoContainer components={['DatePicker']}>
                                                    <DatePicker
                                                        label="End Date"
                                                        value={SeletedRowData.endDate ? SeletedRowData.endDate : null}
                                                        onChange={(date) => {
                                                            setSelectedRowData((pre) => ({ ...pre, endDate: date }));
                                                        }}
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </FormControl>

                                    </div>
                                </ListItem>

                                {/* Shift From Time */}
                                <ListItem>
                                    <div style={{display:'flex',width:"100%" ,position:'relative',alignItems:'center',justifyContent:'center'}}>
                                        <Typography variant='p' style={{fontWeight:'bold',color:ThemeColor.Color}}> ShiftTime From</Typography>
                                        <TextField type='number' label="Hours" id="outlined-start-adornment" sx={{ m: 1,width: '25ch'}}inputProps={{ min: 0, max: 24 }} value={selectedRowFromHour} onChange={handleSelectedFromHoursChange}
                                        />:
                                        <TextField  type='number' label="Minutes" id="outlined-start-adornment" sx={{ m: 1, width: '25ch' }}inputProps={{ min: 0, max: 60 }} value={selectedRowFromMinutes} onChange={handleSelectedFromMinutesChange}
                                        />
                                    </div>
                                </ListItem>

                                {/* Shift End Time */}
                                <ListItem>
                                    <div style={{display:'flex',width:"100%" ,position:'relative',alignItems:'center',justifyContent:'center'}}>
                                        <Typography variant='p' style={{fontWeight:'bold',color:ThemeColor.Color}}> ShiftTime To</Typography>
                                        <TextField type='number' label="Hours" id="outlined-start-adornment" sx={{ m: 1,width: '25ch'}} inputProps={{ min: 0, max: 24 }} value={selectedRowToHour} onChange={handleSelectedToHoursChange}
                                        />:
                                        <TextField type='number' label="Minutes" id="outlined-start-adornment" sx={{ m: 1, width: '25ch' }} inputProps={{ min: 0, max: 60 }} value={selectedRowToMinutes} onChange={handleSelectedToMinutesChange}
                                        />
                                    </div>
                                </ListItem>

                                {/* Update and cancel buttons */}
                                <ListItem style={{ display: 'flex', justifyContent: 'center',gap:'20px' }}>
                                    <Button variant="contained" size='medium' 
                                        sx={{ 
                                            backgroundColor: ThemeColor.Color,
                                            '&:hover': {
                                                backgroundColor: ThemeColor.Color,
                                            },
                                            textTransform:'none',
                                        }}
                                        endIcon={<UpdateIcon/>}
                                        onClick={updateselectedRow}
                                    >Update</Button>
                                    <Button variant="contained" size='medium'color="error" style={{textTransform:'none'}} endIcon={<CancelIcon/>} onClick={handleDialogCloseButton}>Cancel</Button>
                                </ListItem>
                            </List>
                        </Dialog>
                    </>
                    }
                    <Confirmation data={conformationData.data} onAction={handleConfirmationAction} onClose={()=>{setCOnformationData((pre)=>({...pre,visibility:false}))}} open={conformationData.visibility}/>
                    <NotificationComponent backgroundColor={notificationData.color} message={notificationData.message} onClose={()=>{setNotificationData((pre)=>({...pre,visivility:false}))}} open={notificationData.visivility}/>
                    {generatePDF && (
                        <PDFGenerator
                            columns={columns}
                            empSkills={shiftData}
                            employeeName={shiftData.length > 0 ? shiftData[0].employeeName : profileData.employeeName}
                            employeeId={shiftData.length > 0 ? shiftData[0].employeeId : profileData.employeeID}
                            Heading={'Shift Timings Details'}
                        />
                    )}
                    {generateExcel &&(
                            <ConvertExcelFile 
                            data={shiftData} 
                            employeeId={shiftData.length > 0 ? shiftData[0].employeeName : profileData.employeeName}
                            employeeName={shiftData.length > 0 ? shiftData[0].employeeId : profileData.employeeID} 
                            DetailsName={'Shift Timings Details'}
                            columns={columns}
                            />   
                    )}
                </Grid>
            </Grid>
        </Grid>
        </>
    )

  return (
        <div>
            {loading && <Loader />}
            {isMobileScreen ? (
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
export default ShifttimingsDetails
