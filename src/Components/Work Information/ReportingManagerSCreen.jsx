import { Autocomplete, Button, ButtonGroup, Dialog, DialogTitle, FormControl, Grid, List, ListItem, ListItemButton, TextField, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Loader from '../Loader/Loader';
import EditIcon from '@mui/icons-material/Edit';
import { UpdateReportingManagerById, createReportingManager, deletereportingManager, getReportingManagerById } from '../../ProfileApiCalls/WorkInformationApiCalls/WorkInformationApi';
import { getEmployeesDetails, getProfileById } from '../../ProfileApiCalls/profile/Apicalls';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DangerColor, SuccessColor, ThemeColor } from '../ENV Values/envValues';
import AddBoxIcon from '@mui/icons-material/AddBox';
import StyledDataGrid from '../TableCOmponent/Displaytable';
import { CancelButtonStyles} from '../Styles/Styles';
import TimerComponent from '../TimeOutComponent/TimeOut';
import NotificationComponent from '../Notification/NotificationComponent';
import PDFGenerator from '../ConvertPDF/PDFGenerator';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Confirmation from '../Conformation Component/Conformation';
import CancelIcon from '@mui/icons-material/Cancel';
import UpdateIcon from '@mui/icons-material/Update';
import LogoImage from '../../Components/Images/excel-3-xl.png';
import ConvertExcelFile from '../Convert Excel/convertExcelFile';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
function ReportingManagerSCreen() {
    const [employeeID,setEmployeeId]=useState('')
    const isMobileScreen=useMediaQuery((theme)=>theme.breakpoints.down('sm') || theme.breakpoints.down('md') || theme.breakpoints.down('xs'));
    const [loading,setleading]=useState(false);
    const [reportingMnagersData,SetReportingManagersData]=useState([]);
    const [EmployeesDetails,SetEMployeesDetails]=useState([]);
    const [managerNames,SetManagerNames]=useState([]);
    const [dialogBoxVisibility,setDialogBoxVisibility]=useState(false);
    const [toDateVisibility,SetTodateVisibility]=useState(false);
    const [addButtonVisibility,setAddButtonVisibility]=useState(true);
    const [creatRMDialogBox,setCreateRMDialogBox]=useState(false);
    const [generatePDF,setgeneratePDF]=useState(false);
    const [generateExcel,setGenerateExcel]=useState(false);
    const [seletedDeleterowid,setSelectedDeletedrowId]=useState('')
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
    const [CreateRMDetails,SetCreatedRMDetails]=useState({
        managerName:'', 
        startDate:null,
        endDate:null,
        modifiedDate:new Date(),
        modifiedBy:'',
        employeeId:'',
        employeeName:''
    })
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
    const [conformationData,setConformationData]=useState({
        data:'',
        visibility:''
    })
    const [operationName,setoperationName]=useState('')

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleDeleteIconClick=async(rowData)=>{
        console.log("Seleted row data : ",rowData.id)
        setSelectedDeletedrowId(rowData.id);
        setoperationName("Delete RM")
        const fromDate =rowData.startDate ? dayjs(rowData.startDate).format('DD-MM-YYYY'):'Null';
        const toDate =rowData.endDate ? dayjs(rowData.endDate).format('DD-MM-YYYY'):'Null';
        setConformationData((pre)=>({...pre,
            data:`Are you sure you want to delete the current reporting manager?\nManager Name :${rowData.managerName}\nStaet date :${fromDate}\nEnd date :${toDate}`,
                    visibility:true,
        }))

    }
    

    function handleEditClick(values) {
        const startDate = dayjs(values.startDate);
        let endDate = null;
        if (values.endDate) 
        {
            endDate = dayjs(values.endDate);
        }
        SetSelectedReportingManager((manager) => ({
            ...manager,
            employeeId: values.employeeId,
            employeeName: values.employeeName,
            endDate: endDate,
            id: values.id,
            managerName: values.managerName,
            modifiedBy: values.modifiedBy,
            modifiedDate: new Date(),
            startDate: startDate,
        }));
        setDialogBoxVisibility(true);
    }
    

    const columnsData=[
        {field:'managerName',headerName:'Manager Name',width:250},
        {field:'startDate',headerName:'Start Date',width:170, valueFormatter: (params) => params.value ? formatDate(params.value) : ''},
        {field:'endDate',headerName:"End Date",width:170, valueFormatter: (params) => params.value ? formatDate(params.value) : ''},
        {field:'modifiedDate',headerName:'Modified Date',width:170, valueFormatter: (params) => params.value ? formatDate(params.value) : ''},
        {field:'modifiedBy',headerName:'Modified By',width:250},
        {
            field: 'edit',
            headerName: "Edit",
            width: 70,
            renderCell: (params) => (
                <EditIcon 
                    key={params.row.id} 
                    sx={{ color: ThemeColor.Color }}
                    onClick={() => handleEditClick(params.row)}
                />
            )
        },
        {
            field: 'Action',
            headerName: "Delete",
            width: 70,
            renderCell: (params) => (
                <DeleteForeverIcon 
                    key={params.row.id} 
                    sx={{ color: ThemeColor.Color }}
                    onClick={() => handleDeleteIconClick(params.row)}
                />
            )
        }
    ];
    
    const fetchCurrentmployeeDetails=async()=>{
        if(employeeID)
        {
        try
        {
            const currentEMplDetails=await getProfileById(employeeID);
            UpdateProfileData(currentEMplDetails.data)
            SetCreatedRMDetails((pre)=>({
                ...pre,
                employeeId:currentEMplDetails.data.employeeID,
                employeeName:currentEMplDetails.data.employeeName,
                modifiedDate:new Date(),
                modifiedBy:currentEMplDetails.data.employeeID+'-'+currentEMplDetails.data.employeeName,

            }))
        }
        catch(e)
        {

        }
    }
    }
    
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        setEmployeeId(storedUserId);
    }, []);

    useEffect(()=>{
        if(employeeID)
        {
            GetManagerInfomation();
            fetchAllEMployeesDetails();
            fetchCurrentmployeeDetails();
        }
    },[employeeID])

    useEffect(() => {
        if (EmployeesDetails && Array.isArray(EmployeesDetails)) {
            const newOptions = EmployeesDetails.map((employee) => ({
                label: `${employee.employeeID} (${employee.employeeName})`, 
                value: employee.emailId,
            }));
    
            SetManagerNames(newOptions);
        }
    }, [EmployeesDetails]);

    const GetManagerInfomation = async () => {
        if(employeeID)
        {
        try {
            setleading(true);
            const managerResult = await getReportingManagerById(employeeID);
            console.log("Current employee reporting manager fetching MS API result : ",managerResult)
            if(managerResult && managerResult.Status==="OK")
            {
                SetReportingManagersData(managerResult.data);
                setleading(false);
                setNotificationData((pre)=>({
                    ...pre,
                    color:SuccessColor,
                    message:managerResult.Message,
                    visibility:true,
                }))
            }
            else
            {
                setleading(false);
                setNotificationData((pre)=>({
                    ...pre,
                    color:DangerColor,
                    message:managerResult.Message,
                    visibility:true,
                }))
            }
            
        } catch (e) {
            setleading(false);
            setNotificationData((pre)=>({
                ...pre,
                color:DangerColor,
                message:"Unable to Fetching Reporting Manager Details",
                visibility:true,
            }))
        }
    }
    };

    const fetchAllEMployeesDetails = async () => {
        if(employeeID)
        {
            try 
                {
                    const LeaveTypes = await getEmployeesDetails();
                    SetEMployeesDetails(LeaveTypes.data);
                } 
            catch (error) 
                {
                    console.error('Error fetching data:', error);
                }
        }
    };

    const handleOptionChange = (event, newValue) => {
        SetSelectedReportingManager((values) => ({...values, managerName: newValue}));
    };

    const handleOptionChangeNew = (event, newValue) => {
        SetCreatedRMDetails((values) => ({...values, managerName: newValue.label}));
    };

    useEffect(() => {}, [selectedReportingManagerData]);

    const UpdateReportManager=async()=>{  
        setoperationName("Update RM")
        const fromDate =selectedReportingManagerData.startDate ? dayjs(selectedReportingManagerData.startDate).format('DD-MM-YYYY'):'Null';
        const toDate =selectedReportingManagerData.endDate ? dayjs(selectedReportingManagerData.endDate).format('DD-MM-YYYY'):'Null';
        setConformationData((pre)=>({...pre,
            data:`Are you sure you want to update the current reporting manager?\nManager Name :${selectedReportingManagerData.managerName}\nStaet date :${fromDate}\nEnd date :${toDate}`,
                    visibility:true,
        })) 
    }
    
    const insertRmIntoDB=async()=>{
        setoperationName("Create RM")
        const fromDate =CreateRMDetails.startDate ? dayjs(CreateRMDetails.startDate).format('DD-MM-YYYY'):'Null';
        const toDate =CreateRMDetails.endDate ? dayjs(CreateRMDetails.endDate).format('DD-MM-YYYY'):'Null';
        setConformationData((pre)=>({...pre,
            data:`Are you sure you want to create an Reporting manager?\nManager Name :${CreateRMDetails.managerName}\nStaet date :${fromDate}\nEnd date :${toDate}`,
                    visibility:true,
        }))
    }

    const handleGeneratePdfFile=()=>{
        if (!generatePDF) {
            setgeneratePDF(true);
          }
    }

    useEffect(() => {
        if (generatePDF) {       
          setgeneratePDF(false);
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
          if(operationName==='Update RM')
          {
            try{

                setleading(true);
                const updateRMApiResult=await UpdateReportingManagerById(selectedReportingManagerData);
                // console.log("Update reporting manager MS API result : ",updateRMApiResult)
                if(updateRMApiResult && updateRMApiResult.Status==="OK")
                {
                    setDialogBoxVisibility(false);
                    setleading(false);
                    setNotificationData((pre)=>({
                        ...pre,
                        color:SuccessColor,
                        message:updateRMApiResult.Message,
                        visibility:true,
                    }))
                    GetManagerInfomation();
                }
                else
                {
                    setleading(false);
                    setNotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        message:updateRMApiResult.Message,
                        visibility:true,
                    }))
                }
                
            }
            catch(e)
            {
                setleading(false);
                setNotificationData((pre)=>({
                    ...pre,
                    color:DangerColor,
                    message:"Unable to updating Reportinh Manager",
                    visibility:true,
                }))
            }
          }
          else if(operationName==='Create RM')
          {
            try{

                setleading(true);
                const updateRMApiResult=await createReportingManager(CreateRMDetails);
                // console.log("Update reporting manager MS API result : ",updateRMApiResult)
                if(updateRMApiResult && updateRMApiResult.Status==="CREATED")
                {
                    setCreateRMDialogBox(false);
                    setleading(false);
                    setNotificationData((pre)=>({
                        ...pre,
                        color:SuccessColor,
                        message:updateRMApiResult.Message,
                        visibility:true,
                    }))
                    GetManagerInfomation();
                }
                else
                {
                    setleading(false);
                    setNotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        message:updateRMApiResult.Message,
                        visibility:true,
                    }))
                }
                
            }
            catch(e)
            {
                setleading(false);
                setNotificationData((pre)=>({
                    ...pre,
                    color:DangerColor,
                    message:"Unable to creating Reporting Manager",
                    visibility:true,
                }))
            }
          }
          else if(operationName==='Delete RM')
          {
            try{
                if(seletedDeleterowid)
                {
                    setleading(true);
                    const updateRMApiResult=await deletereportingManager(seletedDeleterowid);
                    // console.log("Delete reporting manager MS API result : ",updateRMApiResult)
                    if(updateRMApiResult && updateRMApiResult.Status==="OK")
                    {
                        setDialogBoxVisibility(false);
                        setleading(false);
                        setNotificationData((pre)=>({
                            ...pre,
                            color:SuccessColor,
                            message:updateRMApiResult.Message,
                            visibility:true,
                        }))
                        GetManagerInfomation();
                    }
                    else
                    {
                        setleading(false);
                        setNotificationData((pre)=>({
                            ...pre,
                            color:DangerColor,
                            message:updateRMApiResult.Message,
                            visibility:true,
                        }))
                    }
                    
                }
            }
            catch(e)
            {
                setleading(false);
                setNotificationData((pre)=>({
                    ...pre,
                    color:DangerColor,
                    message:"Unable to updating Reportinh Manager",
                    visibility:true,
                }))
            }
          }
       
      }
      else
      {
        setDialogBoxVisibility(false);
      }
    }

    const body = (
        <Grid container  spacing={0.5} sx={{flex: 1}}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container spacing={0.5}>
                    {/* Heading */}
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <div>
                            <h1 style={{color:ThemeColor.Color, fontFamily: 'emoji',fontSize: '2em',fontWeight: 'bold',}}> Reporting Manager</h1>
                        </div>
                    </Grid>

                    {/* Refresh and creating manager buttons */}
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <div style={{display:'flex',gap:'10px',position:'relative',alignItems:'center', justifyContent:'flex-end'}}>
                            <div>
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
                            </div>
                            <div>
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
                            </div>
                            <div>
                                <Button variant='contained' 
                                    sx={{ backgroundColor:ThemeColor.Color,
                                    color: '#FFFFFF',
                                    '&:hover': {
                                        backgroundColor:ThemeColor.Color,
                                    },
                                    textTransform: 'none',
                                    fontFamily: 'Sans-serif',
                                    }}
                                    onClick={()=>{GetManagerInfomation()}}
                                    startIcon={<RefreshIcon/>}>Refresh
                                </Button>
                            </div>
                          
                            <div>
                                <Button variant='contained'  
                                    sx={{ 
                                        backgroundColor:ThemeColor.Color,
                                        color: '#FFFFFF',
                                        '&:hover': {
                                            backgroundColor:ThemeColor.Color,
                                        },
                                        textTransform: 'none',
                                        fontFamily: 'Sans-serif',
                                        }} 
                                    startIcon={<AddBoxIcon/>} 
                                    onClick={()=>{setCreateRMDialogBox(true)}}
                                >Create RM
                           </Button>
                            </div>
                        </div>
                    </Grid>

                    {/* Reporting Managers Table */}
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <StyledDataGrid rows={reportingMnagersData} columns={columnsData} />
                    </Grid>
                    
                    {/* Dialog box for update reporting Manager */}
                    <Dialog open={dialogBoxVisibility}>
                        <DialogTitle sx={{color:ThemeColor.Color}}>Edit Reporting Manager</DialogTitle>
                        <hr style={{width:"90%",height:"3px",backgroundColor:ThemeColor.Color}}></hr>
                        <List>
                            <ListItemButton>
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
                            </ListItemButton>
                            <ListItemButton>
                                <FormControl sx={{width:'100%',height:'100%'}}>
                                    <LocalizationProvider  dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker label="Start Date"  sx={{width:'100%'}}
                                                value={selectedReportingManagerData.startDate}
                                                onChange={(date) => {
                                                    SetSelectedReportingManager((prevState) => ({ ...prevState, startDate: date }));
                                                }}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </FormControl>
                            </ListItemButton>
                            <ListItemButton>
                                {selectedReportingManagerData.endDate ? (
                                    null
                                ) : (
                                    addButtonVisibility ? (
                                        <Button 
                                            startIcon={<AddIcon/>} 
                                            onClick={() => {
                                                SetTodateVisibility(true);
                                                setAddButtonVisibility(false);
                                            }} 
                                            sx={{color:ThemeColor.Color}}
                                        >
                                            Add to Date
                                        </Button>
                                    ) : (
                                        <Button 
                                        startIcon={<RemoveIcon/>} 
                                        onClick={() => {
                                            SetSelectedReportingManager((pre)=>({...pre, endDate:null}))
                                         SetTodateVisibility(false);
                                        setAddButtonVisibility(true)}} 
                                        sx={{color:ThemeColor.Color}}
                                    >
                                        Remove To Date
                                    </Button>
                                    )
                                )}
                            </ListItemButton>

                            {toDateVisibility && (
                                <ListItemButton>
                                <FormControl sx={{width:'100%',height:'100%'}}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker label='End Date'
                                                onChange={(date) => {
                                                    SetSelectedReportingManager((pre) => ({...pre, endDate: date}));
                                                }}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </FormControl>
                                </ListItemButton>
                            )}
                            <ListItemButton sx={{ display: 'flex', justifyContent: 'center' }}>
                                <ButtonGroup sx={{ gap: '15px' }}>
                                    <Button 
                                        variant='contained' 
                                        sx={{ 
                                            backgroundColor: ThemeColor.Color,
                                            '&:hover': {
                                                backgroundColor: ThemeColor.Color, 
                                            }
                                        }}
                                        onClick={()=>{UpdateReportManager()}}
                                        endIcon={<UpdateIcon/>}
                                    >
                                         Update
                                    </Button>
                                    <Button 
                                        variant='contained' 
                                        sx={CancelButtonStyles} 
                                        onClick={() => setDialogBoxVisibility(false)}
                                        endIcon={<CancelIcon/>}
                                    >
                                        Cancel
                                    </Button>

                                </ButtonGroup>
                            </ListItemButton>

                        </List>
                    </Dialog>

                    <Dialog open={creatRMDialogBox}>
                       <DialogTitle style={{color:ThemeColor.Color}}>Create Reporting Manager</DialogTitle>
                       <hr style={{backgroundColor:ThemeColor.Color,width:'90%',height:'3px'}}></hr>
                       <List>
                            <ListItem>
                            <FormControl sx={{ width: '100%', height: '40%' }}>
                                <Autocomplete 
                                    value={CreateRMDetails.managerName} 
                                    options={managerNames}
                                    isOptionEqualToValue={(option, value) => option.value === value.value}
                                    renderInput={(params) => (
                                    <TextField {...params} label="Manager Name" variant="outlined" />
                                    )}
                                    onChange={handleOptionChangeNew}
                                />
                            </FormControl>

                            </ListItem>
                            <ListItem>
                                <FormControl sx={{width:'100%',height:'100%'}}>
                                    <LocalizationProvider  dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker label="Start Date"  sx={{width:'100%'}}
                                                value={CreateRMDetails.startDate}
                                                onChange={(date) => {
                                                    SetCreatedRMDetails((prevState) => ({ ...prevState, startDate: date }));
                                                }}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </FormControl>
                            </ListItem>
                            <ListItem>
                            <FormControl sx={{width:'100%',height:'100%'}}>
                                    <LocalizationProvider  dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker label="End Date"  sx={{width:'100%'}}
                                                value={CreateRMDetails.endDate}
                                                onChange={(date) => {
                                                    SetCreatedRMDetails((prevState) => ({ ...prevState, endDate: date }));
                                                }}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </FormControl>
                            </ListItem>
                            <ListItem>
                                <ButtonGroup  variant='contained' sx={{gap:'40px',position:'relative',alignItems:'center',justifyContent:'center'}}>
                                    <Button 
                                        sx={{
                                            color:'#FFFF',
                                            backgroundColor:ThemeColor.Color,
                                            '&:hover':{
                                                backgroundColor:ThemeColor.Color
                                            },
                                            textTransform:'none'
                                        }}
                                        onClick={insertRmIntoDB}
                                        endIcon={<AddBoxIcon/>}
                                        >Create</Button>
                                    <Button
                                        sx={{
                                            color:'#FFFF',
                                            backgroundColor:'#ff3333',
                                            '&:hover':{
                                                backgroundColor:'#ff3333'
                                            },
                                            textTransform:'none'
                                        }}
                                        endIcon={<CancelIcon/>}
                                        onClick={()=>{
                                            setCreateRMDialogBox(false);
                                            SetCreatedRMDetails((pre)=>({
                                                ...pre,
                                                endDate:null,
                                                startDate:null,
                                                managerName:''
                                            }))
                                        }}
                                    > Cancel</Button>
                                </ButtonGroup>
                            
                            </ListItem>
                       </List>
                      
                    </Dialog>
                    <NotificationComponent backgroundColor={notificationData.color} message={notificationData.message} onClose={()=>{setNotificationData((pre)=>({...pre,visibility:false}))}} open={notificationData.visibility}/>
                    <Confirmation  data={conformationData.data} onAction={handleConfirmationAction} onClose={()=>{setConformationData((pre)=>({...pre,visibility:false}))}} open={conformationData.visibility}/>
                    <TimerComponent/>
                    {generatePDF && (
                        <PDFGenerator
                            columns={columnsData}
                            empSkills={reportingMnagersData}
                            employeeName={reportingMnagersData.length > 0 ? reportingMnagersData[0].employeeName : profileData.employeeName}
                            employeeId={reportingMnagersData.length > 0 ? reportingMnagersData[0].employeeId : profileData.employeeID}
                            Heading={'Reporting Manager Details'}
                        />
                    )}
                    {generateExcel &&(
                            <ConvertExcelFile 
                            data={reportingMnagersData} 
                            employeeId={reportingMnagersData.length > 0 ? reportingMnagersData[0].employeeName : profileData.employeeName}
                            employeeName={reportingMnagersData.length > 0 ? reportingMnagersData[0].employeeId : profileData.employeeID} 
                            DetailsName={'Reporting Manager Details'}
                            columns={columnsData}
                            />   
                    )}
                </Grid>
            </Grid>
        </Grid>
    );

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
    );
}

export default ReportingManagerSCreen;
