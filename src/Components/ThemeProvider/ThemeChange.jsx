import { Button,  Grid, useMediaQuery } from '@mui/material';
import React, { useState } from 'react'
import { ThemeColor } from '../ENV Values/envValues';
import Loader from '../Loader/Loader';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { ChromePicker } from 'react-color';
function ThemeChange() {
  const [loading,updatLoading]=useState(false)
  const isMobileOrMediumScreen = useMediaQuery((theme) => theme.breakpoints.down('sm') || theme.breakpoints.down('md') || theme.breakpoints.down('xs'));
  const [borderColorVisibility,SetBorderColorVisibility]=React.useState({
    MidnightBlue:false,
    NavyBlue:false,
    Teal:false,
    CobaltBlue:false,
    Verdigris:false,
    RoyalBlue:false,
  })
  const [themeColor,setThemeColor]=React.useState(ThemeColor.Color)

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

  React.useEffect(()=>{},[themeColor])

  function UpdateThemeColor(){
    updatLoading(true)
    console.log(themeColor)
    ThemeColor.Color = themeColor;
    updatLoading(false)
  }
  const [color, setColor] = useState('#144982'); 

  const handleChangeComplete = (newColor) => {
    // console.log(newColor.hex)
    
    setColor(newColor.hex);
    setThemeColor(newColor.hex)
  };

  const body=(
<>

        <Grid container spacing={0.5} style={{flex:1}}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Grid container spacing={0.5}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <div >
                    <h2 style={{color:ThemeColor.Color, fontFamily: 'emoji',fontSize: '2em',fontWeight: 'bold',position:'relative'}} > Select theme Color </h2>
                  </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <hr style={{ background: ThemeColor.Color, color: ThemeColor.Color, borderColor: ThemeColor.Color, height: '3px', maxWidth: "100%", width: "90%" ,paddingTop:''}}></hr>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <Button variant='contained' fullWidth sx={{height:"30px",backgroundColor:ThemeColor.Color,'&:hover':{ backgroundColor:ThemeColor.Color }, border: borderColorVisibility.MidnightBlue && '3px solid #65000b'}} onClick={()=>{SetThemeColorMidnightBlue(ThemeColor.Color)}}>Midnight Blue</Button>
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
                <br/>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
           
                  <Button variant='contained' endIcon={<ColorLensIcon/>} style={{backgroundColor:ThemeColor.Color,color:"#FFFF",'&:hover':{backgroundColor:ThemeColor.Color}}} onClick={()=>{UpdateThemeColor()}}>Apply Theme</Button>
                       
                </Grid>
                </Grid>
          </Grid>

        </Grid>

                      
                    
         
</>
  )
  return (
    <div>
            {loading ? (
                    <>
                      <Loader />
                      {isMobileOrMediumScreen ? (
                        <div style={{ backgroundColor: '#FFFFFF', padding: '0px', position: 'relative', top: '6vh' }}>
                          {body}
                        </div>
                      ) : (
                        <div style={{ backgroundColor: '#FFFFFF', padding: '0px', position: 'relative', top: '6vh', marginLeft: '35vh' }}>
                          {body}
                        </div>
                      )}
                    </>
                 ) : (
                    isMobileOrMediumScreen ? (
                      <div style={{ backgroundColor: '#FFFFFF', padding: '0px', position: 'relative', top: '6vh' }}>
                        {body}
                      </div>
                    ) : (
                      <div style={{ backgroundColor: '#FFFFFF', padding: '0px', position: 'relative', top: '6vh', marginLeft: '35vh' }}>
                        {body}
                      </div>
                    )
                 )}
                 </div>
  )
}

export default ThemeChange

