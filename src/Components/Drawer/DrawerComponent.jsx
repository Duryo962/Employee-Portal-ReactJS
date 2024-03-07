// DrawerComponent.jsx
import React, { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import AddTaskIcon from '@mui/icons-material/AddTask';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import ComputerIcon from '@mui/icons-material/Computer';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { useNavigate } from 'react-router-dom';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import { ThemeColor } from '../ENV Values/envValues';
import LockResetIcon from '@mui/icons-material/LockReset';
import { getProfileById } from '../../ProfileApiCalls/profile/Apicalls';
import { Avatar, useMediaQuery } from '@mui/material';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
const DrawerComponent = ({ expandOptions, leavesExpanded, toggleLeaves ,variantType,open,toggleSkills,skillsExpand,toggleHome,homeExpand,HoliDaysClickOn,toggleWorkInformation,ExpandWorkInformation,toggleAdminAccess,ExpandAdminAccess}) => {
    const navigate=useNavigate();
    const [userId,setuserID]=useState('')
    const[imageUrl,setImageUrl]=useState('')
    const [designation,setDesignation]=useState('');
    const isMobileScreen = useMediaQuery((theme) => theme.breakpoints.down('sm') || theme.breakpoints.down('md') || theme.breakpoints.down('xs'));
    // Set User Id from local storage in onload
    useEffect(()=>{
        const storedUserId = localStorage.getItem('userId');
        setuserID(storedUserId);    
    },[])

    // When ever toggleHome value change  fetch current employee Details
    useEffect(()=>{
        findUserById();
    },[toggleHome])

    // fetching employee details function implementation
    const findUserById=async()=>{
        if(userId)
        {
            try{
                const userDetails=await getProfileById(userId);
               setImageUrl(userDetails.data.imageUrl);
               setDesignation(userDetails.data.designation);
            }
            catch(e)
            {
                console.log("Error to fetch userDetails in drawer component")
            }
        }
    }

  return (
            <Drawer variant={variantType} open={open} sx={{ [`& .MuiDrawer-paper`]: { width: '35vh', height: '90vh', boxSizing: 'border-box', backgroundColor: ThemeColor.Color , border: '2px solid white', marginTop: '10vh', }, }} >
                <List>
                {/* List Item For Home */}
                        <ListItem key="Home" disablePadding>
                            <ListItemButton onClick={toggleHome} >
                                <ListItemIcon>
                                    <HomeIcon style={{ color: 'white' }} />
                                </ListItemIcon>
                                <ListItemText primary="Home" style={{ color: 'white' }} />
                                {homeExpand ? <ExpandLessIcon style={{ color: 'white' }} /> : <ExpandMoreIcon style={{ color: 'white' }} />}
                            </ListItemButton>
                        </ListItem>  
                        <Collapse in={homeExpand} timeout="auto" unmountOnExit>
                                <List>
                                <ListItem key="Profile" disablePadding>
                            <ListItemButton onClick={()=>{
                                navigate('/profile');
                                if (isMobileScreen) {
                                   
                                }
                            }}>
                                <ListItemIcon style={{ color: 'white' }}>
                                    {imageUrl ? <Avatar alt="Remy Sharp" src={imageUrl} sx={{ fontSize: 30 }}/> : <AccountCircleIcon sx={{ fontSize: 30 }} />}
                                    {/* <AccountCircleIcon /> */}
                                </ListItemIcon>
                                <ListItemText primary="Profile" style={{ color: 'white' }} />
                            </ListItemButton>
                        </ListItem>
                                  
                                    <ListItem key="Forgot Password" disablePadding>
                                        <ListItemButton onClick={()=>{
                                             navigate('/ChangePassword');
                                        }}>
                                            <ListItemIcon style={{ color: 'white' }}>
                                                <LockResetIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Forgot Password" style={{ color: 'white' }} />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                        </Collapse>
   
                        <ListItem key="HoliDays List" disablePadding>
                            <ListItemButton onClick={()=>{
                                HoliDaysClickOn()
                                navigate('/HolidaysList')
                            }}>
                                <ListItemIcon style={{ color: 'white' }}>
                                    <HolidayVillageIcon/>
                                </ListItemIcon>
                                <ListItemText primary="HoliDays List" style={{ color: 'white' }} />
                            </ListItemButton>
                        </ListItem>
                </List>
                <Divider /> 
                {/* Parent Leaves List Item */}
                        <ListItem key="leaves" disablePadding>
                                <ListItemButton onClick={toggleLeaves}>
                                    <ListItemIcon style={{ color: 'white' }}>
                                        <LeaderboardIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Leave" style={{ color: 'white' }} />
                                    {leavesExpanded ? <ExpandLessIcon style={{ color: 'white' }} /> : <ExpandMoreIcon style={{ color: 'white' }} />}
                                </ListItemButton>
                        </ListItem>
                        <Collapse in={leavesExpanded} timeout="auto" unmountOnExit> 
                                <List>
                                    {/* Chils List  Item(Leave) For Leaves */}
                                    <ListItem key="leaves" disablePadding>
                                        <ListItemButton  onClick={()=>{
                                            navigate('/LeavesDetails')
                                        }}>
                                            <ListItemIcon style={{ color: 'white' }}>
                                                <AlignVerticalBottomIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Leaves" style={{ color: 'white' }} />
                                        </ListItemButton>
                                    </ListItem>
                                    {/* Leave Requests */}
                                    <ListItem key="leaves Requests" disablePadding>
    {designation === 'Manager' || designation === 'Project Manager' || designation === 'Technical Lead' || designation === 'Vice President' || designation === 'Assistant Vice President' ? (
        <ListItemButton  onClick={() => { navigate('/LeaveRequests') }}>
            <ListItemIcon style={{ color: 'white' }}>
                <PendingActionsIcon />
            </ListItemIcon>
            <ListItemText primary="Leave Requests" style={{ color: 'white' }} />
        </ListItemButton>
    ) : null}
</ListItem>
                                    {/* Child List Item (Apply Leave) For Leaves */}
                                    <ListItem key="apply Leave" disablePadding>
                                        <ListItemButton onClick={()=>{
                                            navigate('/ApplyLeave')
                                        }}>
                                            <ListItemIcon style={{ color: 'white' }}>
                                                <AddTaskIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Apply Leave" style={{ color: 'white' }} />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                        </Collapse>
                {/* Parent Skills List Item */}
                        <ListItem key="Skills" disablePadding>
                                <ListItemButton onClick={toggleSkills}>
                                    <ListItemIcon style={{ color: 'white' }}>
                                        <ComputerIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Skills" style={{ color: 'white' }} />
                                    {skillsExpand ? <ExpandLessIcon style={{ color: 'white' }} /> : <ExpandMoreIcon style={{ color: 'white' }} />}
                                </ListItemButton>
                        </ListItem>
                        <Collapse in={skillsExpand} timeout="auto" unmountOnExit>
                                <List>
                                    {/* Chils List  Item(Leave) For Leaves */}
                                    <ListItem key="Create Skills" disablePadding>
                                        <ListItemButton onClick={()=>{
                                            navigate('/createskills')
                                        }}>
                                            <ListItemIcon style={{ color: 'white' }}>
                                                <LibraryAddIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Create Skills" style={{ color: 'white' }} />
                                        </ListItemButton>
                                    </ListItem>
                                    {/* Child List Item (Apply Leave) For Leaves */}
                                    <ListItem key="Employee Skills" disablePadding>
                                        <ListItemButton onClick={()=>{
                                            navigate('/skillsdetails')
                                        }}>
                                            <ListItemIcon style={{ color: 'white' }}>
                                                <FormatListNumberedIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Employee Skills" style={{ color: 'white' }} />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                        </Collapse>

                        <ListItem key="Work Information" disablePadding>
                                <ListItemButton onClick={toggleWorkInformation}>
                                    <ListItemIcon style={{ color: '#FFFF' }}>
                                        <AddHomeWorkIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Work Information" style={{ color: '#FFFF' }} />
                                    {ExpandWorkInformation ? <ExpandLessIcon style={{ color: 'white' }} /> : <ExpandMoreIcon style={{ color: 'white' }} />}
                                </ListItemButton>
                        </ListItem>
                        <Collapse in={ExpandWorkInformation} unmountOnExit timeout='auto'>
                            <List>
                                <ListItem key='Reporting Manager' disablePadding>
                                    <ListItemButton onClick={()=>{ navigate('/ReportingManager')}}>
                                        <ListItemIcon style={{color:'#FFFF'}}>
                                            <PersonIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary="Reporting Manager" sx={{color:'white'}}>
                                        </ListItemText>

                                    </ListItemButton>
                                </ListItem>
                                <ListItem key='Reporting Manager' disablePadding>
                                    <ListItemButton onClick={()=>{ navigate('/ShiftTimings')}}>
                                        <ListItemIcon style={{color:'#FFFF'}}>
                                            <ScheduleIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary="Shift Timings" sx={{color:'white'}}>
                                        </ListItemText>

                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Collapse>

                        <ListItem key="Admin" disablePadding>
                                <ListItemButton onClick={toggleAdminAccess}>
                                    <ListItemIcon style={{ color: 'white' }}>
                                        <AdminPanelSettingsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Admin" style={{ color: 'white' }} />
                                    {ExpandAdminAccess ? <ExpandLessIcon style={{ color: 'white' }} /> : <ExpandMoreIcon style={{ color: 'white' }} />}
                                </ListItemButton>
                        </ListItem>
                        <Collapse in={ExpandAdminAccess} timeout="auto" unmountOnExit>
                                <List>
                                    {/* Chils List  Item(Leave) For Leaves */}
                                    <ListItem key="Create Profile" disablePadding>
                                        <ListItemButton onClick={()=>{
                                            navigate('/createProfile')
                                        }}>
                                            <ListItemIcon style={{ color: 'white' }}>
                                                <PersonAddIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Create Profile" style={{ color: 'white' }} />
                                        </ListItemButton>
                                    </ListItem>
                                    {/* Child List Item (Apply Leave) For Leaves */}
                                    <ListItem key="Update Employee Details" disablePadding>
                                        <ListItemButton onClick={()=>{
                                            navigate('/UpdateEmployeeData')
                                        }}>
                                            <ListItemIcon style={{ color: 'white' }}>
                                                <ManageAccountsIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Update Emp Details" style={{ color: 'white' }} />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                        </Collapse>
                        
            </Drawer>
        );
};

export default DrawerComponent;
