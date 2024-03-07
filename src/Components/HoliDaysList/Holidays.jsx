import { Button, Grid,  TextField, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Loader from '../Loader/Loader';
import { getHolidaysList } from '../../ProfileApiCalls/Holidays/HolidaysApi';
import SearchIcon from '@mui/icons-material/Search';
import TimerComponent from '../TimeOutComponent/TimeOut';
import StyledDataGrid from '../TableCOmponent/Displaytable';
import { DangerColor, SuccessColor, ThemeColor } from '../ENV Values/envValues';
import NotificationComponent from '../Notification/NotificationComponent';

function Holidays() {
    const isMobileOrMediumScreen = useMediaQuery((theme) => theme.breakpoints.down('sm') || theme.breakpoints.down('md') || theme.breakpoints.down('xs'));
    const [loading,updatLoading]=useState(false);
    const [searchYear,UpdateSearchYear]=useState(new Date().getFullYear())
    const [holidaysList, updateHolidaysList] = useState([]);
    const [notificationData,setNotificationData]=useState({
        color:'',
        message:'',
        visibility:false,
    })
    // Fetching Holidays List in onload
    useEffect(()=>{
        FetchHolidaysList()
    },[])

    useEffect(()=>{},[searchYear,holidaysList])

    // Change date formate(DD-MM-YYYY)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // fetcing Holidays List function implementation
    const FetchHolidaysList=async()=>{
        try{
             updatLoading(true);
            var date=new Date(); 
            const holidaysres=await getHolidaysList(date.getFullYear());
            // console.log("Holidays fetching MS API result : ",holidaysres);
            if(holidaysres && holidaysres.Status==="FOUND")
            {
                const holidays=holidaysres.data;
                const rowsWithIds = holidays.map((row, index) => ({ id: index + 1, ...row }));
                updateHolidaysList(rowsWithIds);
                updatLoading(false);
                setNotificationData((pre)=>({
                    ...pre,
                    color:SuccessColor,
                    message:holidaysres.Message,
                    visibility:true,
                }))
            }
            else{
                updatLoading(false);
                setNotificationData((pre)=>({
                    ...pre,
                    color:DangerColor,
                    message:holidaysres.Message,
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
                message:"Unable to fetching Holidays details",
                visibility:true,
            }))
        }
    }

    // Search button onclick function
    const searchHolidays=async()=>{
        try{
            updatLoading(true);
            const holidaysRes=await getHolidaysList(searchYear);
            // console.log("Holidays fetching MS API Result : ",holidaysRes);
            if(holidaysRes && holidaysRes.Status==="FOUND")
            {
                const holidays=holidaysRes.data;
                const rowsWithIds = holidays.map((row, index) => ({ id: index + 1, ...row }));
                updateHolidaysList(rowsWithIds);
                updatLoading(false);
                setNotificationData((pre)=>({
                    ...pre,
                    color:SuccessColor,
                    message:holidaysRes.Message,
                    visibility:true,
                }))
            }
            else{
                updatLoading(false);
                setNotificationData((pre)=>({
                    ...pre,
                    color:DangerColor,
                    message:holidaysRes.Message,
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
                message:"Unableto Fetching Holiday Details",
                visibility:true,
            }))
            }
    }

    // Columns Declare
    const columns = [
        { field: 'holiDayDate', headerName: 'Holiday_Date', width: 300,valueFormatter: (params) => formatDate(params.value)? formatDate(params.value):''},
        { field: 'holidayName', headerName: 'Holiday_Name', width:300 },
        { field: 'day', headerName: 'Holiday_Day', width: 300 },
        {field: 'holidayYear',headerName: 'Holiday_Year', width:250,},      
        ];

     // Main body
    const body=(
        <div>
            <Grid container sx={{flex:1}} >
                {/* Holidays  Deatails Heading */}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div>
                        <h1 style={{color:ThemeColor.Color, fontFamily: 'emoji',fontSize: '2em',fontWeight: 'bold',}}>Holidays List</h1>
                    </div>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div style={{display: 'flex',justifyContent:'space-between',maxWidth: "100%", width: "90%"}}>
                        <div >
                            <TextField id="noOfDependents" type="number" label="Year" InputLabelProps={{shrink: true,}} value={searchYear} onChange={(e) => UpdateSearchYear(e.target.value)} style={{width: '70%',height: '57px',}} />
                        </div>
                        <div>
                            <Button variant="outlined" sx={{backgroundColor:ThemeColor.Color,color: '#FFFFFF',
                              '&:hover': {
                                  backgroundColor:ThemeColor.Color,
                              },
                              textTransform: 'none',
                              fontFamily: 'Sans-serif',}} startIcon={<SearchIcon  sx={{color:'#FFFF'}}/>} onClick={searchHolidays}>Search</Button>
                        </div>
                    </div>
                </Grid>

                {/* Holidays Table */}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <StyledDataGrid rows={holidaysList} columns={columns} />  
                </Grid>        
                <NotificationComponent backgroundColor={notificationData.color} message={notificationData.message} onClose={()=>{setNotificationData((pre)=>({...pre,visibility:false}))}} open={notificationData.visibility}/>
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

export default Holidays
