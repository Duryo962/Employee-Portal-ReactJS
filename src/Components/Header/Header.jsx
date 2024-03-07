import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import useMediaQuery from '@mui/material/useMediaQuery';
import DrawerComponent from '../Drawer/DrawerComponent';
import { Avatar, Button, ButtonGroup, Dialog, Grid, Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { UpdateThemeColorByID, getProfileById } from '../../ProfileApiCalls/profile/Apicalls';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeColor } from '../ENV Values/envValues';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import CancelIcon from '@mui/icons-material/Cancel';
import { ChromePicker } from 'react-color';
import LogoutIcon from '@mui/icons-material/Logout';

export default function PrimarySearchAppBar() {
  const [userId,setuserID]=React.useState('');
  const isMobileOrMediumScreen = useMediaQuery((theme) => theme.breakpoints.down('sm') || theme.breakpoints.down('md') || theme.breakpoints.down('xs'));
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [drawerVariant, setDrawerVariant] =React.useState(isMobileOrMediumScreen ? 'temporary' : 'permanent');
  const [menubarVisibility,UpdateMenubarVisibility] = React.useState('temporary');
  const [HeaderImage,UpdateHeaderImage]=React.useState('');
  const location = useLocation();
  const navigation=useNavigate();
  const isLoginPage = location.pathname === '/login';
  const [state, setState] = React.useState({
    boxOpen: false,
  });
  const [borderColorVisibility,SetBorderColorVisibility]=React.useState({
    MidnightBlue:false,
    NavyBlue:false,
    Teal:false,
    CobaltBlue:false,
    Verdigris:false,
    RoyalBlue:false,
  })
  const [expandOption, UpdateExpandOptions] = React.useState({
    leaves: false,
    skills:false,
    home:false,
    workInformation:false,
    adminAccess:false,
  });
  const [themeColor,setThemeColor]=React.useState(ThemeColor.Color);
  const [open,setOpen]=React.useState(false);
  const [color, setColor] = React.useState('#144982');

  // Set userid from local storage
  React.useEffect(()=>{
    const storedUserId = localStorage.getItem('userId');
    // console.log(storedUserId);
    setuserID(storedUserId);
  },[])

  // If userid present then fetch employee details
  React.useEffect(() => {
    fetchData();
  }, [userId]);


  React.useEffect(()=>{},[HeaderImage])

  // Set drawer varient dynamically 
  React.useEffect(() => {
    setDrawerVariant(isMobileOrMediumScreen ? 'temporary' : 'permanent');
  }, [isMobileOrMediumScreen]);

    // Fetching Current employee Datils
  const fetchData = async () => {
    if(userId)
      {
        try {
              const empDetails = await getProfileById(userId);
              UpdateHeaderImage(empDetails.data.imageUrl)   
              localStorage.setItem('themeColor', empDetails.data.themeColor);       
            } 
        catch(error) 
            {
              console.error('Error fetching data:', error);
            }
      }
  };

    // This function for close profile menu 
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
        
  }; 
           
   // This function for Open mobile menu
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

   // This Function for mobile menu close
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  // This Function for Profile menu open
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // This function for display and hide mobile nav bar
  const toggleBox = () => {
    setState({ ...state, boxOpen: !state.boxOpen });
  };

    // Reset Theme color and remove themecolor from local storage
  function resetThemeColor() {
    ThemeColor.Color = "#144982"; 
    localStorage.removeItem('themeColor');
  }

  // Logout option onclick function
  const logOutPage=()=>{
    localStorage.removeItem('userId');
    localStorage.removeItem('profileFetched');
    resetThemeColor();
    navigation('/login', { replace: true });
    setAnchorEl(null);
    handleMobileMenuClose();
  }

  // Profile option onclick function
  const NavigateProfile=()=>{
    navigation('/profile', { replace: true });
    setAnchorEl(null);
    handleMobileMenuClose();
  }
        
  // Change thme option onclick function
  function ChangeThemeColor(){
    setAnchorEl(null);
    handleMobileMenuClose();
    setOpen(true)
  }

  // Desktop screen account circle  onclick display options
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu anchorEl={anchorEl} anchorOrigin={{ vertical: 'bottom',horizontal: 'right',}} id={menuId}  keepMounted transformOrigin={{vertical: 'top',horizontal: 'right',}} open={isMenuOpen} onClose={handleMenuClose}>
      <MenuItem onClick={NavigateProfile} style={{color:ThemeColor.Color }}>Profile</MenuItem>
      <MenuItem onClick={ChangeThemeColor}  style={{color:ThemeColor.Color }}>Change Theme Color</MenuItem>  
      {/* <MenuItem onClick={logOutPage}  style={{color:ThemeColor.Color }}>Logout</MenuItem>       */}
    </Menu>
  );
            
  // This code for mobile screen menu
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      >
     {
  !isLoginPage ? (
    [
      // profile option 
      <MenuItem key="profile" onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          {HeaderImage ? (
            <img
              src={HeaderImage}
              alt="HeaderImage"
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            ></img>
          ) : (
            <AccountCircle />
          )}
        </IconButton>
        <p>Profile</p>
      </MenuItem>,
      <MenuItem key="logout" onClick={logOutPage}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <LogoutIcon/>
        </IconButton>
        <p>Logout</p>
      </MenuItem>
    ]
  ) : (
    <MenuItem onClick={handleMenuClose} style={{ color: ThemeColor.Color }}>
      Login
    </MenuItem>
  )
}

    </Menu>
            );
            
  // Midnight Blue color button onclick function
  function SetThemeColorMidnightBlue(color)
  {
      setThemeColor(color);
      SetBorderColorVisibility((pre)=>({
        ...pre,
        MidnightBlue:true,
        CobaltBlue:false,
        NavyBlue:false,
        RoyalBlue:false,
        Teal:false,
        Verdigris:false
      }))
  }

  //  Navy blue clor button onclick function
  function SetThemeColorNavyBlue(color)
    {
      setThemeColor(color);
      SetBorderColorVisibility((pre)=>({
        ...pre,
        MidnightBlue:false,
        CobaltBlue:false,
        NavyBlue:true,
        RoyalBlue:false,
        Teal:false,
        Verdigris:false
      }))

  }

  // Teal color button onclick functon
  function SetThemeColorTeal(color)
  {
      setThemeColor(color);
      SetBorderColorVisibility((pre)=>({
        ...pre,
        MidnightBlue:false,
        CobaltBlue:false,
        NavyBlue:false,
        RoyalBlue:false,
        Teal:true,
        Verdigris:false
      }))
  }

  // Cobalt blue color button onclick function
  function SetThemeColorCobaltBlue(color)
  {
    setThemeColor(color);
    SetBorderColorVisibility((pre)=>({
      ...pre,
      MidnightBlue:false,
      CobaltBlue:true,
      NavyBlue:false,
      RoyalBlue:false,
      Teal:false,
      Verdigris:false
    }))
  }

  // Verdigris color button onclick function
  function SetThemeColorVerdigris(color)
  {
    setThemeColor(color);
    SetBorderColorVisibility((pre)=>({
      ...pre,
      MidnightBlue:false,
      CobaltBlue:false,
      NavyBlue:false,
      RoyalBlue:false,
      Teal:false,
      Verdigris:true
    }))
  }

  // Royal blue color onclick function
  function SetThemeColorRoyalBlue(color)
  {
    setThemeColor(color);
    SetBorderColorVisibility((pre)=>({
      ...pre,
      MidnightBlue:false,
      CobaltBlue:false,
      NavyBlue:false,
      RoyalBlue:true,
      Teal:false,
      Verdigris:false
    }))
  }

  //Update ThemeColor
  const UpdateThemeColorBy=async()=>{
    console.log(themeColor,userId)
    if(themeColor && userId )
    {
      const themeUpdateres=await UpdateThemeColorByID(userId,themeColor);
      console.log("Updte theme color MS API result : ",themeUpdateres)
    }
  } 


  // Theme Dialog box cancel button onclick function
  function DialobBoxcanbutton()
  {
    setThemeColor('');
    SetBorderColorVisibility((pre)=>({
      ...pre,
      MidnightBlue:false,
      CobaltBlue:false,
      NavyBlue:false,
      RoyalBlue:false,
      Teal:false,
      Verdigris:false
    }))
    setOpen(false)
  }

  // Theme dialog box Apply theme button onclick function
  function UpdateThemeColor(){
    ThemeColor.Color = themeColor;
    setOpen(false);
    localStorage.setItem('themeColor', themeColor);
    UpdateThemeColorBy();
    window.location.reload(); 
  
  }

  // Custom color selection onchange function
  const handleChangeComplete = (newColor) => { 
    setColor(newColor.hex);
    setThemeColor(newColor.hex)
  };

  // Leaves options onclicks function
  const toggleLeaves = () => {
    UpdateExpandOptions({ ...expandOption, leaves: !expandOption.leaves ,skills:false,home:false,workInformation:false,adminAccess:false });
  };

  // Home option onclick function
  const toggleHome = () => {
    UpdateExpandOptions({ ...expandOption, home: !expandOption.home ,skills:false,leaves:false,workInformation:false ,adminAccess:false});
  };

// Skills options onclick function
  const toggleSkills = () => {
    UpdateExpandOptions({ ...expandOption, leaves: false,skills:!expandOption.skills,home:false,workInformation:false,adminAccess:false });
  };

  // Holidays option onclick function
  const HoliDaysOnclick=()=>{
    UpdateExpandOptions({ ...expandOption, leaves: false,skills:false,home:false,workInformation:false,adminAccess:false});
  }

  // Work information onclick function
  const toggleWorkInformation=()=>{
    UpdateExpandOptions({ ...expandOption, leaves: false,skills:false,home:false,workInformation:!expandOption.workInformation,adminAccess:false });
  }
  const toggleAdminAccess = () => {
    UpdateExpandOptions({ ...expandOption, leaves: false ,skills:false,home:false,workInformation:false,adminAccess:!expandOption.adminAccess });
  };
  return ( 
        <Box sx={{ flexGrow: 1 }} style={{ display: 'flex' }}>

          {/*  App Bar for Header*/}
          <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height: '10vh' ,backgroundColor:ThemeColor.Color }}>
            <Toolbar>

              {/* Menu Icon (If Screen size is sm, xs and md then only menu Icon dispalyed*/}
              {isMobileOrMediumScreen &&  !isLoginPage && (
                <IconButton size="large" edge="start" color="inherit" aria-label="open drawer" sx={{ mr: 2 }} onClick={toggleBox}>
                  <MenuIcon />
                </IconButton>
              )}

              {/* Declare Header Name  */}
              <Typography variant="h6" noWrap component="div" sx={{ display: 'block',fontFamily:'Serif',fontSize: '1.5em',letterSpacing: '1px',textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',  }}> Employee Portal</Typography>
                          
              {/* This Box is for displayed Header Options */}
              <Box sx={{ flexGrow: 1 }} />

              {/* This box for  Mail,Notifications and Account circle icon display .If screen sixes are above md then displayed */}
              { !isLoginPage && (
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                      <MailIcon />
                    </Badge>
                  </IconButton> */}
                  {/* <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                    <Badge badgeContent={17} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton> */}
                 <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    {HeaderImage ? (
                      <Avatar alt="Remy Sharp" src={HeaderImage} sx={{ fontSize: 50 }} />
                    ) : (
                      <AccountCircle sx={{ fontSize: 50 }} />
                    )}
                  </IconButton>

                  <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                    <Button variant='contained'
                      sx={{
                        color:'#FFFF',
                        backgroundColor:ThemeColor.Color,
                        textTransform:'none',
                        '&:hover':{
                            backgroundColor:ThemeColor.Color
                        }
                      }} 
                      endIcon={<LogoutIcon/>}
                      onClick={logOutPage}>Log out</Button>
                  </IconButton>
                </Box>
              )}

              {/* This box is for More Icon if screen is sm and xs then display remaining screens none */}
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </Box>

            </Toolbar>
          </AppBar>

          <Dialog open={open} sx={{height:'100vh'}} >
                  <Grid container spacing={0.5} style={{flex:1}}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Grid container spacing={0.5}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <div style={{display:'flex',alignItems:'center',justifyContent:'center'}} >
                            <h2 style={{color:ThemeColor.Color, fontFamily: 'emoji',fontSize: '1.5em',fontWeight: 'bold',position:'relative'}} > Select theme Color </h2>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                          <Button variant='contained' fullWidth sx={{height:"30px",backgroundColor:'#144982','&:hover':{ backgroundColor:'#144982' }, border: borderColorVisibility.MidnightBlue && '3px solid #65000b'}} onClick={()=>{SetThemeColorMidnightBlue('#144982')}}>Midnight Blue</Button>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                          <Button variant='contained' fullWidth sx={{height: "30px", backgroundColor: "#1975D1",'&:hover': { backgroundColor: "#1975D1", }  ,border: borderColorVisibility.NavyBlue && '3px solid #65000b'}} onClick={()=>{SetThemeColorNavyBlue("#1975D1")}}>Navy Blue</Button>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                          <Button variant='contained' fullWidth sx={{height:"30px",backgroundColor:'#008080','&:hover':{backgroundColor:'#008080'}, border: borderColorVisibility.Teal && '3px solid #65000b'}} onClick={()=>{SetThemeColorTeal("#008080")}}>Teal</Button>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                          <Button variant='contained' fullWidth sx={{height:"30px",backgroundColor:"#0047AB",'&:hover':{backgroundColor:"#0047AB"}, border: borderColorVisibility.CobaltBlue && '3px solid #65000b'}} onClick={()=>{SetThemeColorCobaltBlue("#0047AB")}}>Cobalt Blue</Button>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                          <Button variant='outlined' fullWidth sx={{backgroundColor:'#40B5AD',height:'30px','&:hover':{backgroundColor:"#40B5AD"},color:'#FFFF', border: borderColorVisibility.Verdigris && '3px solid #65000b'}} onClick={()=>{SetThemeColorVerdigris("#40B5AD")}}>Verdigris</Button>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                          <Button variant='outlined 'fullWidth  sx={{backgroundColor:'#4169E1',height:'30px','&:hover':{backgroundColor:'#4169E1'},color:'#FFFF', border: borderColorVisibility.RoyalBlue && '3px solid #65000b'}} onClick={()=>{SetThemeColorRoyalBlue("#4169E1")}}>Royal Blue</Button>
                        </Grid>
                        <br/>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'15px'}}>
                            <div> 
                              <h3>Select Custom Color</h3>
                              <ChromePicker
                                color={color}
                                onChangeComplete={handleChangeComplete}
                              />
                            </div> 
                            <div>
                              <h3 style={{}}> Result Theme Color</h3>
                              <div style={{backgroundColor:themeColor,width:'200px',height:'200px'}}>
                              </div>
                            </div>
                          </div>

                        </Grid>
                        <br/> <br/><br/>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <ButtonGroup sx={{gap:'10px'}}>
                              <Button variant='contained' endIcon={<ColorLensIcon/>} style={{backgroundColor:ThemeColor.Color,color:"#FFFF",'&:hover':{backgroundColor:ThemeColor.Color}}} onClick={()=>{UpdateThemeColor()}}>Apply Theme</Button>
                              <Button variant='contained' endIcon={<CancelIcon/>} style={{backgroundColor:"#ff0000",color:"#FFFF",'&:hover':{backgroundColor:ThemeColor.Color}}} onClick={()=>{DialobBoxcanbutton()}}>Cancel</Button>
                            </ButtonGroup>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
            </Dialog>

          {/* -------desktop  nav bar------- */}
          {!isLoginPage && !isMobileOrMediumScreen && (
            <DrawerComponent
              expandOptions={expandOption}
              leavesExpanded={expandOption.leaves}
              toggleLeaves={toggleLeaves}
              variantType={drawerVariant}
              toggleSkills={toggleSkills}
              skillsExpand={expandOption.skills}
              toggleHome={toggleHome}
              homeExpand={expandOption.home}
              HoliDaysClickOn={HoliDaysOnclick}
              toggleWorkInformation={toggleWorkInformation}
              ExpandWorkInformation={expandOption.workInformation}
              ExpandAdminAccess={expandOption.adminAccess}
              toggleAdminAccess={toggleAdminAccess}
            />
          )}

          {/* -------Mobile Navbar------- */}
          <DrawerComponent 
            variantType={menubarVisibility} 
            expandOptions={expandOption} 
            leavesExpanded={expandOption.leaves} 
            toggleLeaves={toggleLeaves} 
            open={state.boxOpen} 
            toggleSkills={toggleSkills} 
            skillsExpand={expandOption.skills} 
            toggleHome={toggleHome} 
            homeExpand={expandOption.home}  
            HoliDaysClickOn={HoliDaysOnclick} 
            toggleWorkInformation={toggleWorkInformation} 
            ExpandWorkInformation={expandOption.workInformation}
            ExpandAdminAccess={expandOption.adminAccess}
            toggleAdminAccess={toggleAdminAccess}
          />

          {renderMobileMenu}
          {renderMenu}
        </Box>
  );
}
