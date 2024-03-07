import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, Checkbox, Dialog, DialogTitle, FormControl, FormControlLabel, Grid, InputLabel, List, ListItem,  MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react'
import Loader from '../Loader/Loader';
import { DangerColor, SuccessColor, ThemeColor } from '../ENV Values/envValues';
import SearchIcon from '@mui/icons-material/Search';
import ModeldedTable from '../ModeledTable/ModeldedTable';
import EditIcon from '@mui/icons-material/Edit';
import { UpdateProfileById, UpdateProfileReportingManagerById, UpdateProfileShiftTimingsById, getAllEMployeesNames, getListOfEMployeesDatafromEmployeeID, getListOfEMployeesDatafromEmployeeIdAndName, getListOfEMployeesDatafromEmployeeName, getProfileById, } from '../../ProfileApiCalls/profile/Apicalls';
import CancelIcon from '@mui/icons-material/Cancel';
import NotificationComponent from '../Notification/NotificationComponent';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { getNameValurPairByType } from '../../ProfileApiCalls/AdminAPI/CreateProfileApiCalls';
import UpdateIcon from '@mui/icons-material/Update';
import { useEffect } from 'react';
import Confirmation from '../Conformation Component/Conformation';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TimerComponent from '../TimeOutComponent/TimeOut';
import { UpdateReportingManagerById, getReportingManagerByEmployeeId, getReportingManagerByEmployeeName, getReportingManagerByEmployeeNameAndName } from '../../ProfileApiCalls/WorkInformationApiCalls/WorkInformationApi';
import { getShiftsByEmplyeeId, getShiftsByEmplyeeName, getShiftsByEmplyeeNameAndId, updateShiftimings } from '../../ProfileApiCalls/WorkInformationApiCalls/ShiftTimingsApi';
function UpdateEmpData() {
    const isMobileOrMediumScreen = useMediaQuery((theme) => theme.breakpoints.down('sm') || theme.breakpoints.down('md') || theme.breakpoints.down('xs'));
    const [loading, updateLoading] = useState(false);
    const [designationList,setDesignationList]=useState([]);
    const [profileresultData,setprofileResultData]=useState([]);
    const [ReportingManagerData,setReportingmanagerData]=useState([])
    const [shiftTimngData,setShiftTimingData]=useState([]);
    const [operationName,setOperationName]=useState('');
    const [doj,setDoj]=useState(null);
    const [managerNames,SetManagerNames]=useState([]);
    const [SelectedRowDays,setSelectedRowDays]=useState([]);
    const [shiftTime,setShiftTime]=useState('');
    const [conformationData,setConformationData]=useState({
        data:'',
        visibility:false,
    })
    const [shiftTimingsList,setShiftTimingsList]=useState([]);
    const [expanded, setExpanded] = React.useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
      resetSearchParamaters();
    };
    const [dialogBoxVisibility,setDialgBoxVisibility]=useState({
        updateProfileDialog:false,
        updatermDialog:false,
        shiftTimingsDialog:false,
    })
    const [notificationData,setnotificationData]=useState({
        data:'',
        visibility:false,
        color:''
    })
    const [selectedProfilerofileData,setSelectedProfileData]=useState({
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
        shiftTimes:'',
        themeColor:''
    })
    const [SeletedRowShiftData,setSelectedShiftData]=useState({
        employeeId:'',
        employeeName:'',
        endDate:null,
        id:'',
        modifiedBy:'',
        modifiedDate:null,
        shiftEndTime:'',
        shiftStartTime:'', 
        startDate:null,
        weekOffDays:''
    })
    const [EmployeesDetails,SetEMployeesDetails]=useState([])
    const [selectedReportingManagerData,SetSelectedReportingManager]=useState({
        id:'',
        managerName:'', 
        startDate:null,
        endDate:null,
        modifiedDate:new Date(),
        modifiedBy:'',
        employeeId:'',
        employeeName:''
    })
    const [userId,setEmployeeId]=useState('')
    const [paramaters,setParamaters]=useState({
        employeeId:'',
        employeeName:''
    })
    useEffect(()=>{
        const storedUserId = localStorage.getItem('userId');
        setEmployeeId(storedUserId);
       
    },[])

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

    useEffect(()=>{
        if(userId)
        {
            getDesignationListData();
            fetchAllEMployeesDetails();
            fetchCurrentmployeeDetails();
            getShiftTimingsListData();
        }

    },[userId])

    useEffect(() => {
        SetManagerNames(EmployeesDetails);
    }, [EmployeesDetails]);

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const columns = [
        { field: 'employeeID', headerName: 'Employee ID', width: 130 },
        { field: 'employeeName', headerName: 'Employee Name', width:200 },
        { field: 'designation', headerName: 'Designation', width: 175 },
        { field: 'emailId', headerName: 'Email ID', width: 285 },
        {field: 'dateOfJoining',headerName: 'Date Of Joining',width: 175},
        { field: 'mobileNumber', headerName: 'Mobile Number', width: 150,},
        { field: 'edit', headerName: 'Edit', width: 100,renderCell: (params) => ( <EditIcon sx={{ color: ThemeColor.Color }}  onClick={() => handleEditClick(params.row)} /> ),},
    ];

    const ReportingManagercolumns = [
        { field: 'employeeId', headerName: 'Employee ID', width: 130 },
        { field: 'employeeName', headerName: 'Employee Name', width:200 },
        { field: 'managerName', headerName: 'Manager Name', width: 185 },
        { field: 'startDate', headerName: 'Start Date', width: 155 ,valueFormatter: (params) => params.value ? formatDate(params.value) : ''},
        {
            field: 'endDate',
            headerName: 'End Date',
            width: 155,
            valueFormatter: (params) => params.value ? formatDate(params.value) : ''
        },
        
        {field: 'modifiedBy',headerName: 'Last Modified By',width: 225},
        { field: 'modifiedDate', headerName: 'Last Modified On', width: 150,valueFormatter: (params) => params.value ? formatDate(params.value) : ''},
        { field: 'edit', headerName: 'Edit', width: 100,renderCell: (params) => ( <EditIcon sx={{ color: ThemeColor.Color }}  onClick={() => handleRmTableEditClick(params.row)} /> ),},
    ];

    const shiftTimesColumns=[
        { field: 'employeeId', headerName: 'Employee ID', width: 130 },
        { field: 'employeeName', headerName: 'Employee Name', width:200 },
        {field:'startDate',headerName:'Start Date',width:120,valueFormatter: (params) => params.value ? formatDate(params.value) : ''},
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
                  onClick={() => handleShiftEditClick(params.row)}
                />
            )
        },
    ]

    const resetSearchParamaters=()=>{
        setParamaters((pre)=>({
            ...pre,
            employeeId:'',
            employeeName:''
        }))
    }

    const handleShiftEditClick=(rowdata)=>{
        setSelectedShiftData((pre)=>({
            ...pre,
            id:rowdata.id,
            employeeId:rowdata.employeeId,
            employeeName:rowdata.employeeName,
            endDate:rowdata.endDate ? dayjs(rowdata.endDate):null,
            startDate:rowdata.startDate ? dayjs(rowdata.startDate):null,
            modifiedBy:rowdata.modifiedBy,
            modifiedDate:rowdata.modifiedDate ? rowdata.modifiedDate:null,
        }))
        const timeString ="("+rowdata.shiftStartTime+" To "+rowdata.shiftEndTime+")";
        const regex = /\(([^)]+)\)/;
        const matches = regex.exec(timeString);
        if (matches && matches.length >= 2) {
          const times = matches[1].split(" To ");
          setSelectedShiftData((pre)=>({...pre,shiftStartTime:times[0],shiftEndTime:times[1]}))
        }
        setShiftTime("("+rowdata.shiftStartTime+" To "+rowdata.shiftEndTime+")");
        const weekoffdaysArray=rowdata.weekOffDays.split(', ');
        setSelectedRowDays(weekoffdaysArray);
      setDialgBoxVisibility((pre)=>({
        ...pre,
        shiftTimingsDialog:true,
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

    useEffect(()=>{
        setSelectedShiftData((pre)=>({
            ...pre,
            weekOffDays:SelectedRowDays.join(', '),
        }))
    },[SelectedRowDays])

    const handleEditClick=(rowData)=>{
        const dateString = rowData.dateOfJoining;
        const [day, month, year] = dateString.split("/").map(Number);
        const dateObject = new Date(year, month - 1, day);
        const nextMonth = (dateObject.getMonth()) % 12;
        const nextYear = nextMonth === 0 ? dateObject.getFullYear() + 1 : dateObject.getFullYear();
        const nextDate = new Date(nextYear, nextMonth, day);
        setSelectedProfileData((prevData) => ({
        ...prevData,
        about: rowData.about,
        designation: rowData.designation,
        emailId: rowData.emailId,
        employeeID: rowData.employeeID,
        employeeName: rowData.employeeName,
        imageUrl: rowData.imageUrl,
        mobileNumber: rowData.mobileNumber,
        reportingManager: rowData.reportingManager,
        shiftTimes: rowData.shiftTimes,
        workFrom: rowData.workFrom,
        themeColor: rowData.themeColor,
        dateOfJoining:  dayjs(nextDate),
        }));
        
        setDialgBoxVisibility((prevVisibility) => ({
        ...prevVisibility,
        updateProfileDialog: true,
        }));
    }

    const handleRmTableEditClick=(rowData)=>{
        setDialgBoxVisibility((pre)=>({...pre,updatermDialog:true,updateProfileDialog:false}))
        SetSelectedReportingManager((pre)=>({
            ...pre,
            employeeId:rowData.employeeId,
            employeeName:rowData.employeeName,
            endDate: rowData.endDate ?dayjs(rowData.endDate):'',
            id:rowData.id,
            managerName:rowData.managerName,
            modifiedDate:new Date(),
            startDate:rowData.startDate ? dayjs(rowData.startDate):'',
        }))
    }

    const handleupdateprofileClearClick=()=>{
        setParamaters((pre)=>({
            ...pre,
            employeeId:'',
            employeeName:''
        }));
        setprofileResultData([]);
    }

    const handleupdatereportingManagerClearClick=()=>{
        setParamaters((pre)=>({
            ...pre,
            employeeId:'',
            employeeName:''
        }));
        setReportingmanagerData([])
    }

    const handleupdateShiftTimingsClearClick=()=>{
        setParamaters((pre)=>({
            ...pre,
            employeeId:'',
            employeeName:''
        }));
        setShiftTimingData([]);
    }

    const handleupdateprofileSearchClick=async()=>{
        if(!paramaters.employeeId && !paramaters.employeeName)
        {
            alert("Please provide any parameters.");
        }
        else
        {
            if(paramaters.employeeId && !paramaters.employeeName)
            {
                updateLoading(true);
                const profileData=await getListOfEMployeesDatafromEmployeeID(paramaters.employeeId);
                console.log(profileData.data);
                if(profileData && profileData.Status==="OK")
                {
                    setprofileResultData(profileData.data.map(employee => ({ id: employee.employeeID, ...employee })));
                    updateLoading(false);
                    setnotificationData((pre)=>({
                        ...pre,
                        color:SuccessColor,
                        data:profileData.Message,
                        visibility:true,
                    }))

                }
                else
                {
                    updateLoading(false);
                    setnotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        data:profileData.Message,
                        visibility:true,
                    }))
                }
                

            }
            else if(!paramaters.employeeId && paramaters.employeeName)
            {
                updateLoading(true);
                const profileData=await getListOfEMployeesDatafromEmployeeName(paramaters.employeeName);
                if(profileData && profileData.Status==="OK")
                {
                    setprofileResultData(profileData.data.map(employee => ({ id: employee.employeeID, ...employee })));
                    updateLoading(false);
                    setnotificationData((pre)=>({
                        ...pre,
                        color:SuccessColor,
                        data:profileData.Message,
                        visibility:true,
                    }))

                }
                else
                {
                    updateLoading(false);
                    setnotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        data:profileData.Message,
                        visibility:true,
                    }))
                }
            }
            else if(paramaters.employeeId && paramaters.employeeName)
            {
                updateLoading(true);
                const profileData=await getListOfEMployeesDatafromEmployeeIdAndName(paramaters.employeeId,paramaters.employeeName);
                if(profileData && profileData.Status==="OK")
                {
                    setprofileResultData(profileData.data.map(employee => ({ id: employee.employeeID, ...employee })));
                    updateLoading(false);
                    setnotificationData((pre)=>({
                        ...pre,
                        color:SuccessColor,
                        data:profileData.Message,
                        visibility:true,
                    }))

                }
                else
                {
                    updateLoading(false);
                    setnotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        data:profileData.Message,
                        visibility:true,
                    }))
                }
            }
        }

    }

    const fetchAllEMployeesDetails = async () => {
        if(userId)
        {
            try 
                {
                    const LeaveTypes = await getAllEMployeesNames();
                    SetEMployeesDetails(LeaveTypes.data);

                } 
            catch (error) 
                {
                    console.error('Error fetching data:', error);
                }
        }
    };

    const handleUpdatereportingManagerSearchClick=async()=>{
        if(!paramaters.employeeId && !paramaters.employeeName)
        {
            alert("Please provide any parameters.");
        }
        else
        {
            if(paramaters.employeeId && !paramaters.employeeName)
            {
                updateLoading(true);
                const profileData=await getReportingManagerByEmployeeId(paramaters.employeeId);
                if(profileData && profileData.Status==="OK")
                {
                    setReportingmanagerData(profileData.data.map(employee => ({ id: employee.employeeId, ...employee })));
                    updateLoading(false);
                    setnotificationData((pre)=>({
                        ...pre,
                        color:SuccessColor,
                        data:profileData.Message,
                        visibility:true,
                    }))

                }
                else
                {
                    updateLoading(false);
                    setnotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        data:profileData.Message,
                        visibility:true,
                    }))
                }
                

            }
            else if(!paramaters.employeeId && paramaters.employeeName)
            {
                updateLoading(true);
                const profileData=await getReportingManagerByEmployeeName(paramaters.employeeName);
                console.log(profileData)
                if(profileData && profileData.Status==="OK")
                {
                    setReportingmanagerData(profileData.data.map(employee => ({
                        id: employee.id,
                        employeeId: employee.employeeId || '',
                        employeeName: employee.employeeName || '',
                        endDate: employee.endDate ?  employee.endDate:'',
                        managerName: employee.managerName || '',
                        modifiedBy: employee.modifiedBy || '',
                        modifiedDate: employee.modifiedDate || '',
                        startDate: employee.startDate || ''
                    })));
                    
                    
                    updateLoading(false);
                    setnotificationData((pre)=>({
                        ...pre,
                        color:SuccessColor,
                        data:profileData.Message,
                        visibility:true,
                    }))

                }
                else
                {
                    updateLoading(false);
                    setnotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        data:profileData.Message,
                        visibility:true,
                    }))
                }
            }
            else if(paramaters.employeeId && paramaters.employeeName)
            {
                updateLoading(true);
                const profileData=await getReportingManagerByEmployeeNameAndName(paramaters.employeeId,paramaters.employeeName);
                if(profileData && profileData.Status==="OK")
                {
                    setReportingmanagerData(profileData.data.map(employee => ({ id: employee.employeeId, ...employee })));
                    updateLoading(false);
                    setnotificationData((pre)=>({
                        ...pre,
                        color:SuccessColor,
                        data:profileData.Message,
                        visibility:true,
                    }))

                }
                else
                {
                    updateLoading(false);
                    setnotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        data:profileData.Message,
                        visibility:true,
                    }))
                }
            }
        }

    }

    const handleUpdateShiftTimigsSearchClick=async()=>{
        if(!paramaters.employeeId && !paramaters.employeeName)
        {
            alert("Please provide any parameters.");
        }
        else
        {
            if(paramaters.employeeId && !paramaters.employeeName)
            {
                updateLoading(true);
                const profileData=await getShiftsByEmplyeeId(paramaters.employeeId);
                if(profileData && profileData.Status==="OK")
                {
                    setShiftTimingData(profileData.data.map(employee => ({ id: employee.id, ...employee })));
                    updateLoading(false);
                    setnotificationData((pre)=>({
                        ...pre,
                        color:SuccessColor,
                        data:profileData.Message,
                        visibility:true,
                    }))

                }
                else
                {
                    updateLoading(false);
                    setnotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        data:profileData.Message,
                        visibility:true,
                    }))
                }
                

            }
            else if(!paramaters.employeeId && paramaters.employeeName)
            {
                updateLoading(true);
                const profileData=await getShiftsByEmplyeeName(paramaters.employeeName);
                console.log(profileData)
                if(profileData && profileData.Status==="OK")
                {
                    setShiftTimingData(profileData.data.map(employee => ({ id: employee.id, ...employee })));
                    updateLoading(false);
                    setnotificationData((pre)=>({
                        ...pre,
                        color:SuccessColor,
                        data:profileData.Message,
                        visibility:true,
                    }))

                }
                else
                {
                    updateLoading(false);
                    setnotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        data:profileData.Message,
                        visibility:true,
                    }))
                }
            }
            else if(paramaters.employeeId && paramaters.employeeName)
            {
                updateLoading(true);
                const profileData=await getShiftsByEmplyeeNameAndId(paramaters.employeeId,paramaters.employeeName);
                if(profileData && profileData.Status==="OK")
                {
                    setReportingmanagerData(profileData.data.map(employee => ({ id: employee.id, ...employee })));
                    updateLoading(false);
                    setnotificationData((pre)=>({
                        ...pre,
                        color:SuccessColor,
                        data:profileData.Message,
                        visibility:true,
                    }))

                }
                else
                {
                    updateLoading(false);
                    setnotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        data:profileData.Message,
                        visibility:true,
                    }))
                }
            }
        }

    }

    const handleUpdateprofileCancelButton=()=>{
        setDialgBoxVisibility((pre)=>({...pre,updateProfileDialog:false,updatermDialog:false}))
    }

    const handleUpdateProfileUpdateButton=()=>{
        setOperationName("Update Profile")
        const data=`Are you sure you want to Update employee profile\nEmployee ID:${selectedProfilerofileData.employeeID}\nEmployee Name :${selectedProfilerofileData.employeeName}\nDesignation :${selectedProfilerofileData.designation}\nEmail ID :${selectedProfilerofileData.emailId}\nMobile Number :${selectedProfilerofileData.mobileNumber}\nDate Of joining :${selectedProfilerofileData.dateOfJoining}`;
        setConformationData((pre)=>({
            ...pre,
            data:data,
            visibility:true,
        }))
        setDialgBoxVisibility((pre)=>({
            ...pre,
            updateProfileDialog:false,
        }))

    }

    const fetchCurrentmployeeDetails=async()=>{
        if(userId)
        {
        try
        {
            const currentEMplDetails=await getProfileById(userId);
            SetSelectedReportingManager((pre)=>({
                ...pre,
                modifiedBy:currentEMplDetails.data.employeeID+'-'+currentEMplDetails.data.employeeName,
            }))
        }
        catch(e)
        {

        }
    }
    }

    const handleConfirmationAction =async(result) => {
        if(result==='ok')
        { 
        if(operationName==='Update Profile')
        {
            try{
                updateLoading(true);
                const updateRes=await UpdateProfileById(selectedProfilerofileData);
                console.log("Update Profile data MS API result : ",updateRes)
            updateLoading(false)
                if(updateRes && updateRes.Status==="OK")
                {
                    setnotificationData((pre)=>({
                        ...pre,
                        color:SuccessColor,
                        data:updateRes.Message,
                        visibility:true
                    }))

                }
                else
                {
                    setnotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        data:updateRes.Message,
                        visibility:true
                    }))
                }
            }
            catch(e)
            {
                setnotificationData((pre)=>({
                    ...pre,
                    color:DangerColor,
                    data:"Unable to Update EMployee details.Please try again.",
                    visibility:true
                }))
            }
        }
        else if(operationName==="Update Reporting Manager")
            {
                try{
                    updateLoading(true)
                    const updateRes=await UpdateReportingManagerById(selectedReportingManagerData);
                    const res=await UpdateProfileReportingManagerById(selectedReportingManagerData.employeeId,selectedReportingManagerData.managerName);
                    console.log("Update Reporting manager MS API Result : ",updateRes,res)
                    updateLoading(false)
                    if(updateRes && updateRes.Status==="OK")
                    {
                        setnotificationData((pre)=>({
                            ...pre,
                            color:SuccessColor,
                            data:updateRes.Message,
                            visibility:true
                        }))

                    }
                    else
                    {
                        setnotificationData((pre)=>({
                            ...pre,
                            color:DangerColor,
                            data:updateRes.Message,
                            visibility:true
                        }))
                    }
                }
                catch(e)
                {
                    setnotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        data:"Unable to Update EMployee details.Please try again.",
                        visibility:true
                    }))
                }
        }
        else if(operationName==="Update Shift Data")
            {
                try{
                    updateLoading(true)
                    const updateRes=await updateShiftimings(SeletedRowShiftData.id,SeletedRowShiftData);
                    const updateShiftRes=await UpdateProfileShiftTimingsById(SeletedRowShiftData.employeeId,shiftTime)
                    console.log("Update Reporting manager MS API Result : ",updateRes,updateShiftRes)
                    updateLoading(false)
                    if(updateRes && updateRes.Status==="OK")
                    {
                        setnotificationData((pre)=>({
                            ...pre,
                            color:SuccessColor,
                            data:updateRes.Message,
                            visibility:true
                        }))

                    }
                    else
                    {
                        setnotificationData((pre)=>({
                            ...pre,
                            color:DangerColor,
                            data:updateRes.Message,
                            visibility:true
                        }))
                    }
                }
                catch(e)
                {
                    setnotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        data:"Unable to Update EMployee details.Please try again.",
                        visibility:true
                    }))
                }
        }
        }
        
    }

    const handleOptionChange = (event, newValue) => {
        SetSelectedReportingManager((values) => ({...values, managerName: newValue}));
    };

    const handleUpdateRMUpdateButton=()=>{
        console.log(selectedReportingManagerData);
        setOperationName("Update Reporting Manager")
        const startDate=dayjs(selectedReportingManagerData.startDate).format("DD/MM/YYYY");
        const endDate=dayjs(selectedReportingManagerData.endDate).format('DD/MM/YYYY')
        console.log(selectedReportingManagerData)
        const data=`Are you sure you want to Update Reporting Manager\nEmployee ID:${selectedReportingManagerData.employeeId}\nEmployee Name :${selectedReportingManagerData.employeeName}\nStart Date :${startDate}\nEnd Date:${endDate}`;
        setConformationData((pre)=>({
            ...pre,
            data:data,
            visibility:true,
        }))
        setDialgBoxVisibility((pre)=>({
            ...pre,
            updatermDialog:false,
        }))
    }

    const handleShiftUpdateClearButton=()=>{
        setDialgBoxVisibility((pre)=>({...pre,shiftTimingsDialog:false}))
    }

    const handleUpdateShiftTimingsDataSetting=(shift)=>{
        const timeString = shift;
        const regex = /\(([^)]+)\)/;
        const matches = regex.exec(timeString);
        if (matches && matches.length >= 2) {
          const times = matches[1].split(" To ");
         
          setSelectedShiftData((pre)=>({...pre,shiftStartTime:times[0],shiftEndTime:times[1]}))
          console.log("From :",times[0],"to :",times[1])
        }
    }

    const handleUpdateShiftTimings=()=>{
        setOperationName("Update Shift Data")
        const startDate=SeletedRowShiftData.startDate ? dayjs(SeletedRowShiftData.startDate).format("DD-MM-YYYY"):null;
        const endDate=SeletedRowShiftData.endDate ?dayjs(SeletedRowShiftData.endDate).format("DD-MM-YYYY"):null;
        const data=`Are you sure you want to Update Shift timings ?\nEmployee ID:${SeletedRowShiftData.employeeId}\nEmployee Name :${SeletedRowShiftData.employeeName}\nStart Date :${startDate}\nEnd Date :${endDate}\nShift Start time :${SeletedRowShiftData.shiftStartTime}\nShift End time :${SeletedRowShiftData.shiftEndTime}\nWeek Off days :${SeletedRowShiftData.weekOffDays}`;
        setConformationData((pre)=>({
            ...pre,
            data:data,
            visibility:true,
        }))
        setDialgBoxVisibility((pre)=>({
            ...pre,
            shiftTimingsDialog:false,
        }))
    }

    const body=(
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start',overflow:"auto", height: '90vh' ,paddingtop:'-10px'}}>
            <Grid container spacing={1} style={{ flex: 1 }}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid container spacing={1}>
                        {/* Heading */}
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div >
                                <h1 style={{color:ThemeColor.Color, fontFamily: 'emoji',fontSize: '2em',fontWeight: 'bold',}} >Update Employee Details</h1>
                            </div>
                        </Grid>

                        {/* Update ProfileData accordion */}
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <div>
                            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{width:"95%", left: '12px'}}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon  sx={{color:'#FFFF'}}/>}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                    sx={{backgroundColor:ThemeColor.Color}}
                                >
     
                                    <Typography sx={{ color: '#FFFF' }}>Update Profile Data</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div style={{display:'flex'}}>
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <TextField type='number' label="Emp ID" size='small'
                                            value={paramaters.employeeId}
                                            onChange={(e)=>{
                                                const empId=e.target.value;
                                                setParamaters((pre)=>({...pre,employeeId:empId}))
                                            }}
                                        ></TextField>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <TextField type='text' label="Emp Name" size='small'
                                            value={paramaters.employeeName}
                                            onChange={(e)=>{
                                                const empName=e.target.value;
                                                setParamaters((pre)=>({...pre,employeeName:empName}))
                                            }}
                                        ></TextField>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <div style={{display:'flex',gap:'10px'}}>
                                            <Button size='medium' sx={{color:"#FFFF",'&:hover':{backgroundColor:ThemeColor.Color},backgroundColor:ThemeColor.Color,textTransform:'none'}} endIcon={<SearchIcon/>} onClick={handleupdateprofileSearchClick}>Search</Button>
                                            <Button size='medium' sx={{color:"#FFFF",'&:hover':{backgroundColor:ThemeColor.Color},backgroundColor:ThemeColor.Color,textTransform:'none'}} endIcon={<CancelIcon/>} onClick={handleupdateprofileClearClick}>Clear</Button>
                                        </div>
                                    </Grid>
                                    </div>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <ModeldedTable columns={columns} rows={profileresultData}/>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                            
                            <div style={{ position:'relative',bottom:'-15px'}}>
                                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}  sx={{width:"95%", left: '12px'}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{color:'#FFFF'}}/>}
                                        aria-controls="panel2bh-content"
                                        id="panel2bh-header"
                                        sx={{backgroundColor:ThemeColor.Color}}
                                    >
                                    <Typography sx={{ color: '#FFFF' }}>
                                    Update Reporting Manager
                                    </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                    <div style={{display:'flex'}}>
                                            <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                                <TextField type='number' label="Emp ID" size='small'
                                                    value={paramaters.employeeId}
                                                    onChange={(e)=>{
                                                        const empId=e.target.value;
                                                        setParamaters((pre)=>({...pre,employeeId:empId}))
                                                    }}
                                                ></TextField>
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                                <TextField type='text' label="Emp Name" size='small'
                                                    value={paramaters.employeeName}
                                                    onChange={(e)=>{
                                                        const empName=e.target.value;
                                                        setParamaters((pre)=>({...pre,employeeName:empName}))
                                                    }}
                                                ></TextField>
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                                <div style={{display:'flex',gap:'10px'}}>
                                                    <Button size='medium' sx={{color:"#FFFF",'&:hover':{backgroundColor:ThemeColor.Color},backgroundColor:ThemeColor.Color,textTransform:'none'}} endIcon={<SearchIcon/>} onClick={handleUpdatereportingManagerSearchClick}>Search</Button>
                                                    <Button size='medium' sx={{color:"#FFFF",'&:hover':{backgroundColor:ThemeColor.Color},backgroundColor:ThemeColor.Color,textTransform:'none'}} endIcon={<CancelIcon/>} onClick={handleupdatereportingManagerClearClick}>Clear</Button>
                                                </div>
                                            </Grid>
                                            </div>
                                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                <ModeldedTable columns={ReportingManagercolumns} rows={ReportingManagerData || []}/>
                                            </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                            <div style={{ position:'relative',bottom:'-30px'}}>
                                <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}  sx={{width:"95%", left: '12px'}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{color:'#FFFF'}}/>}
                                        aria-controls="panel3bh-content"
                                        id="panel3bh-header"
                                        sx={{backgroundColor:ThemeColor.Color}}
                                    >
                                    <Typography sx={{ color: '#FFFF' }}>
                                    Update Shift Timings
                                    </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                    <div style={{display:'flex'}}>
                                            <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                                <TextField type='number' label="Emp ID" size='small'
                                                    value={paramaters.employeeId}
                                                    onChange={(e)=>{
                                                        const empId=e.target.value;
                                                        setParamaters((pre)=>({...pre,employeeId:empId}))
                                                    }}
                                                ></TextField>
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                                <TextField type='text' label="Emp Name" size='small'
                                                    value={paramaters.employeeName}
                                                    onChange={(e)=>{
                                                        const empName=e.target.value;
                                                        setParamaters((pre)=>({...pre,employeeName:empName}))
                                                    }}
                                                ></TextField>
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                                <div style={{display:'flex',gap:'10px'}}>
                                                    <Button size='medium' sx={{color:"#FFFF",'&:hover':{backgroundColor:ThemeColor.Color},backgroundColor:ThemeColor.Color,textTransform:'none'}} endIcon={<SearchIcon/>} onClick={handleUpdateShiftTimigsSearchClick}>Search</Button>
                                                    <Button size='medium' sx={{color:"#FFFF",'&:hover':{backgroundColor:ThemeColor.Color},backgroundColor:ThemeColor.Color,textTransform:'none'}} endIcon={<CancelIcon/>} onClick={handleupdateShiftTimingsClearClick}>Clear</Button>
                                                </div>
                                            </Grid>
                                            </div>
                                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                <ModeldedTable columns={shiftTimesColumns} rows={shiftTimngData || []}/>
                                            </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        </div>
                           
                        </Grid>
                    

                        <Dialog open={dialogBoxVisibility.updateProfileDialog}>
                            <DialogTitle style={{color:ThemeColor.Color,position:'relative',alignItems:'center',justifyContent:'center'}}> Edit Profile Data</DialogTitle>
                            <List >
                                <hr style={{ background: ThemeColor.Color, borderColor: ThemeColor.Color, height: '3px', maxWidth: "100%", width: "90%" }}></hr>
                                        
                                {/* Working Select */}
                                <ListItem>
                                    <FormControl style={{width:"100%",height:"40%"}} >
                                        <TextField label="Employee Name" size='medium'
                                            value={selectedProfilerofileData.employeeName}  
                                            onChange={(e)=>{
                                                const empName=e.target.value;
                                                setSelectedProfileData((pre)=>({...pre,employeeName:empName}))
                                            }}
                                        />
                                    </FormControl>
                                </ListItem>

                                <ListItem>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker 
                                                label="Date Of joining"  
                                                sx={{width:'100%'}}
                                                value={doj ? doj:selectedProfilerofileData.dateOfJoining} 
                                                onChange={(date) => {
                                                    if (date) {
                                                        setDoj(date);
                                                        const dayjsDate = dayjs(date);
                                                        const formattedDate = dayjsDate.format('DD/MM/YYYY');
                                                        setSelectedProfileData((prev) => ({
                                                            ...prev,
                                                            dateOfJoining: formattedDate + '',
                                                        }));
                                                       
                                                    }
                                                }}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </ListItem>

                                <ListItem>
                                    <FormControl style={{width:"100%",height:"7%",}} >
                                        <InputLabel id="demo-simple-select-helper-label_Designation">Designation</InputLabel>
                                            <Select   labelId="demo-simple-select-helper-label_Designation" id="demo-simple-select-helper_designation" label="Designation" 
                                                value={selectedProfilerofileData.designation}
                                                onChange={(e)=>{
                                                    const designation=e.target.value;
                                                    setSelectedProfileData((pre)=>({
                                                        ...pre,
                                                        designation:designation
                                                    }))
                                                }}    
                                            >
                                                { designationList ? designationList.map((designation) => (  <MenuItem key={designation.id} value={designation.value}> {designation.value} </MenuItem> )): null }
                                            </Select>
                                    </FormControl>
                                </ListItem>

                                <ListItem>
                                    <FormControl style={{width:"100%",height:"40%"}} >
                                        <TextField label="Email ID" size='medium'
                                            value={selectedProfilerofileData.emailId} 
                                            onChange={(e)=>{
                                                const email=e.target.value;
                                                setSelectedProfileData((pre)=>({...pre,emailId:email}))
                                            }}

                                        />
                                    </FormControl>
                                </ListItem>

                                <ListItem>
                                    <FormControl style={{width:"100%",height:"40%"}} >
                                        <TextField label="Mobile Number" size='medium'type='number'
                                            value={selectedProfilerofileData.mobileNumber} 
                                            onChange={(e)=>{
                                                const mobilr=e.target.value;
                                                setSelectedProfileData((pre)=>({...pre,mobileNumber:mobilr}))
                                            }}
                                        />
                                    </FormControl>
                                </ListItem>

                                <ListItem>
                                    <div style={{display:'flex', alignItems:'center',justifyContent:'center',gap:'10px'}}>
                                        <Button variant='contained' sx={{backgroundColor:ThemeColor.Color,'&:hover':{backgroundColor:ThemeColor.Color},color:"#FFFF"}} endIcon={<UpdateIcon/>} onClick={handleUpdateProfileUpdateButton}>
                                            Update
                                        </Button >
                                        <Button variant='contained' sx={{backgroundColor:DangerColor,'&:hover':{backgroundColor:DangerColor},color:"#FFFF"}} endIcon={<CancelIcon/>} onClick={handleUpdateprofileCancelButton}>Cancel</Button>
                                    </div>
                                </ListItem>
                            </List>
                        </Dialog>


                        <Dialog open={dialogBoxVisibility.updatermDialog }>
                            <DialogTitle style={{color:ThemeColor.Color,position:'relative',alignItems:'center',justifyContent:'center'}}> Edit Reporting Manager Data</DialogTitle>
                            <List >
                                <hr style={{ background: ThemeColor.Color, borderColor: ThemeColor.Color, height: '3px', maxWidth: "100%", width: "90%" }}></hr>
                                        
                                {/* Working Select */}
                                <ListItem>
                                <FormControl sx={{width:'100%',height:'40%'}}>
                                    <Autocomplete 
                                        label={'Manager Name'}
                                        value={selectedReportingManagerData.managerName} 
                                        options={managerNames}
                                        isOptionEqualToValue={(option, value) => option.value === value.value}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Manager Name" variant="outlined" />
                                        )}
                                        onChange={handleOptionChange}
                                    />
                                </FormControl>
                                </ListItem>

                                <ListItem>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker 
                                                label="Start Date"  
                                                sx={{width:'100%'}}
                                                value={selectedReportingManagerData.startDate|| null} 
                                                onChange={(date) => {
                                                    if (date) {
                                                        SetSelectedReportingManager((pre)=>({...pre,startDate:date}))
                                                    }
                                                }}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </ListItem>
                                <ListItem>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker 
                                                label="End Date"  
                                                sx={{width:'100%'}}
                                                value={selectedReportingManagerData.endDate|| null} 
                                                onChange={(date) => {
                                                    if (date) {
                                                        SetSelectedReportingManager((pre)=>({...pre,endDate:date}))
                                                    }
                                                }}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </ListItem>
                                <ListItem>
                                    <div style={{display:'flex', alignItems:'center',justifyContent:'center',gap:'10px'}}>
                                        <Button variant='contained' sx={{backgroundColor:ThemeColor.Color,'&:hover':{backgroundColor:ThemeColor.Color},color:"#FFFF"}} endIcon={<UpdateIcon/>} onClick={handleUpdateRMUpdateButton}>
                                            Update
                                        </Button >
                                        <Button variant='contained' sx={{backgroundColor:DangerColor,'&:hover':{backgroundColor:DangerColor},color:"#FFFF"}} endIcon={<CancelIcon/>} onClick={handleUpdateprofileCancelButton}>Cancel</Button>
                                    </div>
                                </ListItem>
                            </List>
                        </Dialog>

                        <Dialog open={dialogBoxVisibility.shiftTimingsDialog} fullWidth={true} maxWidth={'sm'}>
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
                                        <FormControl style={{ width: isMobileOrMediumScreen ? "70%" : "50%", height: "100%" }} >
                                            <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                                                <DemoContainer components={['DatePicker']}>
                                                    <DatePicker label="Start Date"  sx={{width:'100%'}}
                                                        value={SeletedRowShiftData.startDate}
                                                        onChange={(date) => {
                                                            setSelectedShiftData((pre) => ({ ...pre, startDate: date }));  
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
                                    <FormControl style={{ width: isMobileOrMediumScreen ? "70%" : "50%", height: "100%" }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                                                <DemoContainer components={['DatePicker']}>
                                                    <DatePicker
                                                        label="End Date"
                                                        value={SeletedRowShiftData.endDate ? SeletedRowShiftData.endDate : null}
                                                        onChange={(date) => {
                                                            setSelectedShiftData((pre)=>({...pre,endDate:date}))
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
                                        <FormControl style={{width: "60%",height:"7%",}} >
                                            <InputLabel id="demo-simple-select-helper-label_shifttimings">Shift Timings</InputLabel>
                                                <Select   labelId="demo-simple-select-helper-label_shifttimings" id="demo-simple-select-helper" label="Shift Timings"
                                                    value={shiftTime}
                                                    onChange={(e)=>{
                                                        const shift=e.target.value;
                                                        setShiftTime(shift);
                                                        handleUpdateShiftTimingsDataSetting(shift);
                                                       
                                                    }}
                                                >
                                                    { shiftTimingsList ? shiftTimingsList.map((shiftTime) => (  <MenuItem key={shiftTime.id} value={shiftTime.value}> {shiftTime.value} </MenuItem> )): null }
                                            </Select>
                                        </FormControl>
                        
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
                                        onClick={handleUpdateShiftTimings}
                                    >Update</Button>
                                    <Button variant="contained" size='medium'color="error" style={{textTransform:'none'}} endIcon={<CancelIcon/>} onClick={handleShiftUpdateClearButton}>Cancel</Button>
                                </ListItem>
                            </List>
                        </Dialog>
                       
                        <NotificationComponent 
                            message={notificationData.data} 
                            onClose={() => setnotificationData((pre) => ({...pre, visibility: false}))}  
                            open={notificationData.visibility} 
                            backgroundColor={notificationData.color}
                        />
                        <Confirmation
                            data={conformationData.data}
                            onAction={handleConfirmationAction}
                            onClose={() => setConformationData((prev) => ({ ...prev, visibility: false }))}
                            open={conformationData.visibility}
                        />
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
  )
}

export default UpdateEmpData
