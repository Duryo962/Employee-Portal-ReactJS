import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useMediaQuery from '@mui/material/useMediaQuery';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Profile from './Components/Profile';



export default function PrimarySearchAppBar() {
  const isMobileOrMediumScreen = useMediaQuery((theme) => theme.breakpoints.down('sm') || theme.breakpoints.down('md') || theme.breakpoints.down('xs'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerVariant, setDrawerVariant] =React.useState(isMobileOrMediumScreen ? 'temporary' : 'permanent');
  const [drawerWidth, setDrawerWidth] =React.useState(isMobileOrMediumScreen ? 0 : 35);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [menubarVisibility,UpdateMenubarVisibility] = React.useState('temporary');
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [expandOption, UpdateExpandOptions] = React.useState({
          leaves: false
          });

  React.useEffect(() => {
    setDrawerVariant(isMobileOrMediumScreen ? 'temporary' : 'permanent');
    setDrawerWidth(isMobileOrMediumScreen ? 0 : 35);
  }, [isMobileOrMediumScreen]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom',horizontal: 'right',}} id={menuId}
        keepMounted
        transformOrigin={{vertical: 'top',horizontal: 'right',}}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose} style={{color:"#1976D2"}}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}  style={{color:"#1976D2"}}>Logout</MenuItem>      
      </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
        <Menu
          anchorEl={mobileMoreAnchorEl}
          anchorOrigin={{vertical: 'top',horizontal: 'right', }}
          id={mobileMenuId}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right', }}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
        >
          <MenuItem>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <p>Messages</p>
          </MenuItem>
          <MenuItem>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <p>Notifications</p>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <p>Profile</p>
          </MenuItem>
        </Menu>
  );


  const [state, setState] = React.useState({
    boxOpen: false,
  });

  const toggleBox = () => {
    setState({ ...state, boxOpen: !state.boxOpen });
  };

  const list = () => (
    <Box>
      <List>
          <ListItem key={"Home"} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                   <HomeIcon style={{color:"white"}}/>
                </ListItemIcon >
                <ListItemText primary={"Home"} style={{color:"white"}} />
              </ListItemButton>
          </ListItem>
          <ListItem key={"Profile"} disablePadding>
            <ListItemButton >
              <ListItemIcon style={{color:"white"}}>
                  <AccountCircleIcon/>
              </ListItemIcon>
              <ListItemText primary={"Profile"} style={{color:"white"}}/>
            </ListItemButton>
          </ListItem>
      </List>
      <Divider />
          <ListItem key={"leaves"} disablePadding>
            <ListItemButton onClick={expandOptions}>
              <ListItemIcon style={{color:"white"}}>
                <LeaderboardIcon/>
              </ListItemIcon>
              <ListItemText primary={"Leave"} style={{color:"white"}}/>
              {expandOption.leaves ? <ExpandLessIcon style={{color:"white"}} /> : <ExpandMoreIcon style={{color:"white"}} />}      
            </ListItemButton>
          </ListItem>
        <Collapse in={expandOption.leaves} timeout="auto" unmountOnExit>
            <Box pl={1.5}>
              <ListItem key={"leaves"} disablePadding>
                <ListItemButton >
                  <ListItemIcon style={{color:"white"}}>
                    <AlignVerticalBottomIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"Leaves"} style={{color:"white"}}/>
                </ListItemButton>
              </ListItem>
                <ListItem key={"apply Leave"} disablePadding>
                  <ListItemButton  >
                    <ListItemIcon style={{color:"white"}}>
                      <AddTaskIcon/>
                    </ListItemIcon>
                    <ListItemText primary={"Apply Leave"} style={{color:"white"}}/>
                  </ListItemButton>
                </ListItem>
            </Box>
        </Collapse>
        <ListItem key={"Home"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
                <HomeIcon style={{color:"white"}}/>
            </ListItemIcon >
            <ListItemText primary={"Home"} style={{color:"white"}} />
          </ListItemButton>
        </ListItem>
    </Box>
  );

 
  function expandOptions() {
    UpdateExpandOptions({ ...expandOption, leaves: !expandOption.leaves });
  }
  
  return (
        <Box sx={{ flexGrow: 1 }} style={{ display: 'flex' }}>
              <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 ,height:"10vh"}}>
                    <Toolbar>
                          {isMobileOrMediumScreen &&  (
                            <IconButton size="large" edge="start" color="inherit" aria-label="open drawer" sx={{ mr: 2 }} onClick={toggleBox} >
                              <MenuIcon />
                            </IconButton>
                          )}
                        <Typography variant="h6" noWrap component="div" sx={{ display: 'block' }} > Demo App </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                                <Badge badgeContent={4} color="error">
                                     <MailIcon />
                                </Badge>
                            </IconButton>
                            <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                                <Badge badgeContent={17} color="error">
                                  <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <IconButton edge="end" aria-label="account of current user"  aria-controls={menuId}  aria-haspopup="true" onClick={handleProfileMenuOpen} color="inherit">
                                <AccountCircle sx={{ fontSize: 50 }}/>
                            </IconButton>
                          </Box>
                          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton size="large" aria-label="show more"  aria-controls={mobileMenuId} aria-haspopup="true" onClick={handleMobileMenuOpen} color="inherit" >
                              <MoreIcon  />
                            </IconButton>
                          </Box>
                    </Toolbar>
              </AppBar>

{/* -------desktop------- */}

              {!isMobileOrMediumScreen && (
                    <Drawer variant={drawerVariant}sx={{ [`& .MuiDrawer-paper`]: {  width: `${drawerWidth}vh`,  height: "100vh", boxSizing: 'border-box', backgroundColor: '#1976D2', border: '2px solid white', },}}>
                      <Toolbar />
                      <Box sx={{ overflow: 'auto' }}>
                          <List>
                                <ListItem key={"Home"} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <HomeIcon style={{color:"white"}}/>
                                        </ListItemIcon >
                                        <ListItemText primary={"Home"} style={{color:"white"}} />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem key={"Profile"} disablePadding>
                                    <ListItemButton >
                                      <ListItemIcon style={{color:"white"}}>
                                          <AccountCircleIcon/>
                                      </ListItemIcon>
                                      <ListItemText primary={"Profile"} style={{color:"white"}}/>
                                    </ListItemButton>
                                </ListItem>
                          </List>
                          <Divider />
                          <ListItem key={"leaves"} disablePadding>
                              <ListItemButton onClick={expandOptions}>
                                  <ListItemIcon style={{color:"white"}}>
                                      <LeaderboardIcon/>
                                  </ListItemIcon>
                                  <ListItemText primary={"Leave"} style={{color:"white"}}/>
                                  {expandOption.leaves ? <ExpandLessIcon style={{color:"white"}} /> : <ExpandMoreIcon style={{color:"white"}} />}                       
                              </ListItemButton>
                          </ListItem>
                          <Collapse in={expandOption.leaves} timeout="auto" unmountOnExit>
                                <Box pl={1.5}>
                                      <ListItem key={"leaves"} disablePadding>
                                          <ListItemButton >
                                              <ListItemIcon style={{color:"white"}}>
                                                  <AlignVerticalBottomIcon/>
                                              </ListItemIcon>
                                              <ListItemText primary={"Leaves"} style={{color:"white"}}/>
                                          </ListItemButton>
                                      </ListItem>
                                      <ListItem key={"apply Leave"} disablePadding>
                                          <ListItemButton >
                                              <ListItemIcon style={{color:"white"}}>
                                                  <AddTaskIcon/>
                                              </ListItemIcon>
                                              <ListItemText primary={"Apply Leave"} style={{color:"white"}}/>
                                          </ListItemButton>
                                      </ListItem>
                                </Box>
                          </Collapse>
                          <ListItem key={"Home"} disablePadding>
                              <ListItemButton>
                                  <ListItemIcon>
                                    <HomeIcon style={{color:"white"}}/>
                                  </ListItemIcon >
                                  <ListItemText primary={"Home"} style={{color:"white"}} />
                              </ListItemButton>
                          </ListItem>
                      </Box>
                   </Drawer>
             )}

{/* -------Mobile------- */}
          <Drawer open={state.boxOpen} variant={menubarVisibility} 
              sx={{ [`& .MuiDrawer-paper`]: { width: `35vh`, height: "100vh", boxSizing: 'border-box', backgroundColor: '#1976D2', border: '2px solid white', marginTop:"6vh"},}}>
              {list()}
          </Drawer>

          <Box component="main"sx={{flexGrow: 1,  p: 3, width: isMobileOrMediumScreen ? '100vh' : '65vh', marginLeft: isMobileOrMediumScreen ? '0vh': "35vh", transition: 'margin-left 2.0s' ,height:"90vh"}}>
            <Toolbar />
                {/* <Typography paragraph>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
                  enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
                  imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
                  Convallis convallis tellus id interdum velit laoreet id donec ultrices.
                  Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                  adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
                  nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
                  leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
                  feugiat vivamus at augue. At augue eget arcu dictum varius duis at
                  consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
                  sapien faucibus et molestie ac.
                </Typography>
                <Typography paragraph>
                  Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
                  eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
                  neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
                  tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
                  sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
                  tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
                  gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
                  et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
                  tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
                  eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
                  posuere sollicitudin aliquam ultrices sagittis orci a.
                </Typography> */}
                <Profile />
          </Box>
          {renderMobileMenu}
          {renderMenu}
        </Box>
  );
}