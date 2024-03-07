import { Grid, Dialog, DialogTitle, List, ListItemButton, FormControl, InputLabel, Select, MenuItem, TextField,  Button, useMediaQuery,  } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { deleteSkill, getEmployeeSkills, updateEmployeeSkills } from '../../ProfileApiCalls/Skills/CreateSkillsApiCall';
import EditIcon from '@mui/icons-material/Edit';
import { getSkills, getWorkingDetails } from '../../ProfileApiCalls/Skills/CreateSkillsApiCall';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Loader from '../Loader/Loader';
import TimerComponent from '../TimeOutComponent/TimeOut';
import RefreshIcon from '@mui/icons-material/Refresh';
import StyledDataGrid from '../TableCOmponent/Displaytable';
import { DangerColor, SuccessColor, ThemeColor } from '../ENV Values/envValues';
import PDFGenerator from '../ConvertPDF/PDFGenerator';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Conformation from '../Conformation Component/Conformation';
import NotificationComponent from '../Notification/NotificationComponent';
import { getProfileById } from '../../ProfileApiCalls/profile/Apicalls';
import UpdateIcon from '@mui/icons-material/Update';
import CancelIcon from '@mui/icons-material/Cancel';
import LogoImage from '../../Components/Images/excel-3-xl.png';
import ConvertExcelFile from '../Convert Excel/convertExcelFile';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
function SkillsDetails() {
  const [userId,setuserID]=useState('')
  const [loading,updatLoading]=useState(false)
  const isMobileOrMediumScreen = useMediaQuery((theme) => theme.breakpoints.down('sm') || theme.breakpoints.down('md') || theme.breakpoints.down('xs'));
  const [empSkills,updateEmpSkills]=useState([]);
  const [open, setOpen] = useState(false);
  const [skills,updateSkills]=useState([]);
  const [working,UpdateWorking]=useState([]);
  const [generatePDF, setGeneratePDF] = useState(false);
  const [conformationData,setConformationDate]=useState('');
  const [conformationVisibility,setCnformationVisibility]=useState(false);
  const [operationName,setoperationName]=useState('');
  const [generateExcel,setGenerateExcel]=useState(false);
  const [selectedDeleteRowId,setSelectedDeleteRow]=useState("");
  const [selectSkill,UpdateSelectSkill]=useState({
          companyName:'',
          endDate:null,
          id:'',
          skill:'',
          startDate:null,
          skillsPeriodDays:'',
          working:'',
  })
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
    visibility:false
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
         
  useEffect(()=>{
    const storedUserId = localStorage.getItem('userId');
    setuserID(storedUserId);
  },[])

        // Fetching Both Skills, work and fetching skills details functions declarations
  useEffect(() => {
    if(userId)
      {
        fetchSkills();
        fetchWorkDetails();
        fetchingSkillsDetails();
        fetchingEmployeeDetails();
      }
  }, [userId]);

  const fetchingEmployeeDetails=async()=>{
    try{
      const profileData=await getProfileById(userId);
      UpdateProfileData(profileData.data);
    }
    catch(e)
    {
      console.log("Error to fetching profile details in skills details component")
    }
  }

        // Fetch Skills function Implementation
  const fetchSkills = async () => {
    try {
          const skills = await getSkills();
          updateSkills(skills.data);
        } 
    catch (error) 
        {
           console.error('Error fetching data:', error);
        }
  };

        // Getting Working function implementation
  const fetchWorkDetails = async () => {
    try {
          updatLoading(true)
          const workDetails = await getWorkingDetails();
          UpdateWorking(workDetails.data);
          updatLoading(false);
        } 
    catch (error) 
        {
          console.error('Error fetching data:', error);
          updatLoading(false)
        }
  };  

          //  When ever skills updated this use effect work
  useEffect(()=>{},[selectSkill,empSkills])

          // Skills Getting from MS API function
  const fetchingSkillsDetails = async () => {
    try {
          updatLoading(true)
          const empDetailsRes = await getEmployeeSkills(userId);
          if(empDetailsRes && empDetailsRes.Status==="OK")
          {
            // console.log("Current employee skills details fetching MS API result : ",empDetailsRes);
            const empDetails=empDetailsRes.data;
            const rowsWithIds = empDetails.map((row, index) => ({ id: index + 1, ...row }));
            updateEmpSkills(rowsWithIds); 
            updatLoading(false);   
            setNotificationData((pre)=>({
              ...pre,
              color:SuccessColor,
              message:empDetailsRes.Message,
              visibility:true,
            }))
          }
          else
          {
            updatLoading(false);   
            setNotificationData((pre)=>({
              ...pre,
              color:DangerColor,
              message:empDetailsRes.Message,
              visibility:true,
            }))
          }
        } 
    catch (error) 
        {
          updatLoading(false);
          setNotificationData((pre)=>({
            ...pre,
            color:DangerColor,
            message:"Unable to fetching skills",
            visibility:true,
          }))
        }
  };

  
  function validations() 
  {
    var isValid = true;
          
            // Company Validation
    if (!selectSkill.companyName) 
      {
        updateError((prevState) => ({ ...prevState, companyErr: 'Enter Company' }));
        isValid = false; 
      } 
    else 
      {
        updateError((prevState) => ({ ...prevState, companyErr: '' }));
      }
          
            // Work Validation
    if (!selectSkill.working) 
      {
        updateError((prevState) => ({ ...prevState, workErr: 'Select Work' }));
        isValid = false; 
      } 
    else 
      {
        updateError((prevState) => ({ ...prevState, workErr: '' }));
      }
          
            // Skills Validation
    if (!selectSkill.skill) 
      {
        updateError((prevState) => ({ ...prevState, skillsErr: 'Select Skill' }));
        isValid = false;
      } 
    else
      {
        updateError((prevState) => ({ ...prevState, skillsErr: '' }));
      }
          
            // Start date validation
    if (!selectSkill.startDate) 
      {
        updateError((prevState) => ({ ...prevState, startDateErr: 'Select Start Date' }));
        isValid = false;
      } 
    else 
      {
        updateError((prevState) => ({ ...prevState, startDateErr: '' }));
      }
          
            // End Date Validation
    if (!selectSkill.endDate) 
      {
        updateError((prevState) => ({ ...prevState, endDateErr: 'Select End Date' }));
        isValid = false; 
      } 
    else 
      {
        updateError((prevState) => ({ ...prevState, endDateErr: '' }));
      }

    if(selectSkill.endDate <=selectSkill.startDate)
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

  useEffect(() => {
    const calculateDays = () => {
    const startDate = selectSkill.startDate ? new Date(selectSkill.startDate) : null;
    const endDate = selectSkill.endDate ? new Date(selectSkill.endDate) : null;
    if (startDate && endDate) 
      {
        const timeDifference = endDate.getTime() - startDate.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        UpdateSelectSkill((prevSkillsData) => ({
          ...prevSkillsData,
          skillsPeriodDays: daysDifference + 1,
        }));
      }
    };
    calculateDays();
  }, [selectSkill]); 

          //  Update Skills Function implementation
  const UpdaetSkillsData=async()=>{
    const validationRes=validations();
    if(validationRes===true)
      {
        setoperationName('Update Skill');
        const fromDate = dayjs(selectSkill.startDate).format('DD-MM-YYYY');
        
        const toDate = dayjs(selectSkill.endDate).format('DD-MM-YYYY');
        const confirmation=`Are you sure you want to Update Selected Skill\nSkill :${selectSkill.skill}\nWorking As :${selectSkill.working}\nCompany Name :${selectSkill.companyName}\nSkill Start Date :${fromDate}\nSkill End Date :${toDate}\n  Total Days : ${selectSkill.skillsPeriodDays}`;
        setConformationDate(confirmation)
        setCnformationVisibility(true);
  }
  }
          // Edit icon click function (Getting selected row data)
  function handleEditClick(data){
    const startDate = dayjs(data.startDate);
    const endDate = dayjs(data.endDate);
    UpdateSelectSkill({
      companyName: data.companyName,
      endDate: endDate,
      id: data.id,
      skill: data.skill,
      startDate: startDate,
      skillsPeriodDays: data.skillsPeriodDays,
      working: data.working,
      employeeId:data.employeeId,
      employeeName:data.employeeName
    });  
    setOpen(true)
  }

  const handleDeleteClick=async(rowData)=>{
    setSelectedDeleteRow(rowData.id);
    setoperationName('Delete Skill');
        const fromDate =rowData.startDate ? dayjs(rowData.startDate).format('DD-MM-YYYY'):null;
        const toDate =rowData.endDate ? dayjs(rowData.endDate).format('DD-MM-YYYY'):null;
        const confirmation=`Are you sure you want to delete Selected Skill\nSkill :${rowData.skill}\nWorking As :${rowData.working}\nCompany Name :${rowData.companyName}\nSkill Start Date :${fromDate}\nSkill End Date :${toDate}\n  Total Days : ${rowData.skillsPeriodDays}`;
        setConformationDate(confirmation)
        setCnformationVisibility(true);

  }

          // Close Dialog box(pop up) function
  function handleClose(){
    setOpen(false);
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

          // Columns Declaration
  const columns = [
                    { field: 'skill', headerName: 'Skill', width: 140 },
                    { field: 'working', headerName: 'Working', width:140 },
                    { field: 'companyName', headerName: 'Company Name', width: 225 },
                    {field: 'startDate',headerName: 'Start Date ', width:140,valueFormatter: (params) => formatDate(params.value) ? formatDate(params.value):''},
                    { field: 'endDate', headerName: 'End Date', width: 150,valueFormatter: (params) => formatDate(params.value) ? formatDate(params.value):''},
                    { field: 'skillsPeriodDays', headerName: 'Skills_Period(Days)', width: 150,},
                    { field: 'edit', headerName: 'Edit', width: 100,renderCell: (params) => ( <EditIcon sx={{ color: ThemeColor.Color }}  onClick={() => handleEditClick(params.row)} /> ),},
                    { field: 'delete', headerName: 'Delete', width: 100,renderCell: (params) => ( <DeleteForeverIcon sx={{ color: ThemeColor.Color }}  onClick={() => handleDeleteClick(params.row)} /> ),},
  
  ];

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

  const handleConfirmationAction =async(result) => {
    if(result==='ok')
    {
      if(operationName==='Update Skill')
      {
        try
              {
                updatLoading(true)
                const res=await updateEmployeeSkills(selectSkill.id,selectSkill);
                if(res && res.Status==="OK")
                {
                  const empDetailsRes = await getEmployeeSkills(userId);
                  const empDetails=empDetailsRes.data;
                  const rowsWithIds = empDetails.map((row, index) => ({ id: index + 1, ...row }));
                  updateEmpSkills(rowsWithIds);   
                  handleClose();
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
                  message:"Unable to updating skill",
                  visibility:true,
                }))
                           
             }
      }
      else if(operationName==='Delete Skill')
      {
        try
              {
                if(selectedDeleteRowId)
                {
                    updatLoading(true)
                    const dletedSKillRes=await deleteSkill(selectedDeleteRowId);
                    // console.log("Delete Skill MS API result : ",dletedSKillRes);
                    if(dletedSKillRes && dletedSKillRes.Status==="OK")
                    {
                      const empDetailsRes = await getEmployeeSkills(userId);
                      const empDetails=empDetailsRes.data;
                      const rowsWithIds = empDetails.map((row, index) => ({ id: index + 1, ...row }));
                      updateEmpSkills(rowsWithIds);   
                      handleClose();
                      updatLoading(false);
                      setNotificationData((pre)=>({
                        ...pre,
                        color:SuccessColor,
                        message:dletedSKillRes.Message,
                        visibility:true,
                      }))
                    }
                    else
                    {
                      setNotificationData((pre)=>({
                        ...pre,
                        color:DangerColor,
                        message:dletedSKillRes.Message,
                        visibility:true,
                      }))
                    }
                    
                }
             }
            catch(e)
             {
                updatLoading(false);
                setNotificationData((pre)=>({
                  ...pre,
                  color:DangerColor,
                  message:"Unable to updating skill",
                  visibility:true,
                }))
                           
             }
      }
      

    }
    else
      {
        setOpen(false);
        const alertMessage = [
          error.companyErr,
          error.endDateErr,
          error.skillsErr,
          error.startDateErr,
          error.workErr
        ].filter(message => message !== null && message !== '').join('\n');
        if (alertMessage) 
          {
            alert(alertMessage);
          }
      }
  };

          // Main body
  const body=(
              <div>
                <Grid container sx={{flex:1}} >
                  {/* Skills Deatails Heading */}
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div>
                      <h1 style={{color:ThemeColor.Color, fontFamily: 'emoji',fontSize: '2em',fontWeight: 'bold',}}>Skills Details</h1>
                    </div>
                  </Grid>

                  {/* Refresh button */}
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div style={{display: 'flex',
                          position: 'relative',
                          alignItems: 'flex-end',
                          justifyContent: 'flex-end',
                        gap:'8px'}}  
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
                      <Button variant='contained'  
                        sx={{
                            backgroundColor:ThemeColor.Color,color: '#FFFFFF',
                            '&:hover': {
                                  backgroundColor:ThemeColor.Color,
                            },
                            textTransform: 'none',
                            fontFamily: 'Sans-serif',
                        }}
                        onClick={fetchingSkillsDetails}  
                        startIcon={<RefreshIcon/>}
                      >Refresh</Button>
                    </div>
                  </Grid>

                  {/* Skills Table */}
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <StyledDataGrid rows={empSkills} columns={columns}/>
                  </Grid>

                  {/* Dialog Box (pop up) */}
                  <Dialog open={open} >
                    <DialogTitle style={{color:ThemeColor.Color,position:'relative',alignItems:'center',justifyContent:'center'}}>Edit Skill</DialogTitle>
                      <List >
                        <hr style={{ background: ThemeColor.Color, borderColor: ThemeColor.Color, height: '3px', maxWidth: "100%", width: "90%" }}></hr>
                                        
                        {/* Working Select */}
                        <ListItemButton>
                          <FormControl style={{width:"100%",height:"40%"}} >
                            <InputLabel id="demo-simple-select-helper-label">Workng</InputLabel>
                            <Select  labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" label="Woking" value={selectSkill.working}  
                              onChange={(e) => {
                                var work = e.target.value; 
                                UpdateSelectSkill(prevState => ({ ...prevState, working: work }))} 
                              }
                            >
                              { working ? working.map((work) => (  <MenuItem key={work.id} value={work.name}> {work.value} </MenuItem> )): null }
                            </Select>
                          </FormControl>
                        </ListItemButton>

                        {/* Company Text Field */}
                        <ListItemButton>
                          <FormControl style={{width:"100%",height:"40%"}} >
                            <TextField id="outlined-basic" label="Company Name" variant="outlined" value={selectSkill.companyName} 
                              onChange={(e) => {
                                var company = e.target.value;
                                UpdateSelectSkill(prevState => ({ ...prevState, companyName: company }))}
                              }
                            />
                          </FormControl>
                        </ListItemButton>

                        {/* Skills Select  */}
                        <ListItemButton >
                          <FormControl style={{width:"100%",height:"40%"}} >
                            <InputLabel id="demo-simple-select-helper-label">Skill</InputLabel>
                            <Select  labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" label="Skill" value={selectSkill.skill}
                              onChange={(e) => {
                                var skill1 = e.target.value;
                                UpdateSelectSkill(prevState => ({ ...prevState, skill: skill1 })) ;}
                              }
                            >
                              {skills ? skills.map((skill) => (<MenuItem key={skill.id} value={skill.name}>  {skill.value}   </MenuItem> )) : null }
                            </Select>
                          </FormControl>
                        </ListItemButton>

                        {/* Start Date */}
                        <ListItemButton >
                          <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                            <DemoContainer components={['DatePicker']}>
                              <DatePicker label="start Date"  sx={{width:'100%'}} value={selectSkill.startDate}
                                onChange={(date) =>
                                  UpdateSelectSkill(prevState => ({ ...prevState, startDate: date }))
                                }
                              />
                            </DemoContainer>
                          </LocalizationProvider>     
                        </ListItemButton>
                                        
                        {/* End Date */}
                        <ListItemButton >
                          <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                            <DemoContainer components={['DatePicker']}>
                              <DatePicker label="End Date"  sx={{width:'100%'}} value={selectSkill.endDate} 
                                onChange={(date) => 
                                  UpdateSelectSkill(prevState => ({ ...prevState, endDate: date }))
                                } 
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </ListItemButton>

                        {/* Button */}
                        <ListItemButton style={{ display: 'flex', justifyContent: 'center',gap:'20px' }}>
                          <Button variant="contained" size='medium' onClick={UpdaetSkillsData} 
                            sx={{ 
                                backgroundColor: ThemeColor.Color,
                                textTransform:'none',
                                '&:hover': {
                                              backgroundColor: ThemeColor.Color,
                                           },
                            }}
                            endIcon={<UpdateIcon/>}
                          >Update</Button>
                          <Button variant="contained" size='medium' onClick={handleClose} color="error" endIcon={<CancelIcon/>} style={{textTransform:'none'}}>Cancel</Button>
                        </ListItemButton>
                      </List>
                  </Dialog>
                </Grid>
                <Conformation open={conformationVisibility} onClose={() => setCnformationVisibility(false)}  onAction={handleConfirmationAction}  data={conformationData} />
                <NotificationComponent backgroundColor={notificationData.color} message={notificationData.message} onClose={()=>{setNotificationData((pre)=>({...pre,visibility:false}))}} open={notificationData.visibility}/>
                <TimerComponent/>
                {generatePDF && (
                <PDFGenerator
                    columns={columns}
                    empSkills={empSkills}
                    employeeName={empSkills.length > 0 ? empSkills[0].employeeName : profileData.employeeName}
                    employeeId={empSkills.length > 0 ? empSkills[0].employeeId : profileData.employeeID}
                    Heading={'Employee Skills Details'}
                />
                )}
                {generateExcel &&(
                <ConvertExcelFile 
                  data={empSkills} 
                  employeeId={empSkills.length > 0 ? empSkills[0].employeeName : profileData.employeeName}
                  employeeName={empSkills.length > 0 ? empSkills[0].employeeId : profileData.employeeID} 
                  DetailsName={'Employee Skills Details'}
                  columns={columns}
                  />   
                )} 
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

export default SkillsDetails;
