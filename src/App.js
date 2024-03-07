import React, { Suspense } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PrimarySearchAppBar from './Components/Header/Header';
import Loader from './Components/Loader/Loader.jsx';
import { UserProvider } from './Components/UserIdStore/UserContext.js';

// Lazy loading components
const Profile = React.lazy(() => import('./Components/Profile/Profile'));
const SkillsDetails = React.lazy(() => import('./Components/Skills/SkillsDetails'));
const CreateSkills = React.lazy(() => import('./Components/Skills/CreateSkills'));
const LeavesDetails = React.lazy(() => import('./Components/Leaves/LeavesDetails'));
const ApplyLeave = React.lazy(() => import('./Components/Leaves/ApplyLeave'));
const LeaveRequests = React.lazy(() => import('./Components/Leaves/LeaveRequests'));
const Holidays = React.lazy(() => import('./Components/HoliDaysList/Holidays'));
const LoginPage = React.lazy(() => import('./Components/LogInPage/loginPage.jsx'));
const ChangePassword = React.lazy(() => import('./Components/ChangePassword/ChangePassword.jsx'));
const ReportingManagerSCreen = React.lazy(() => import('./Components/Work Information/ReportingManagerSCreen.jsx'));
const ThemeChange = React.lazy(() => import('./Components/ThemeProvider/ThemeChange.jsx'));
const ShifttimingsDetails = React.lazy(() => import('./Components/Work Information/ShifttimingsDetails.jsx'));
const CreateProfile = React.lazy(() => import('./Components/AdminComponents/CreateProfile.jsx'));
const UpdateEmpData = React.lazy(() => import('./Components/AdminComponents/UpdateEmpData.jsx'));
const theme = createTheme();

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
      <UserProvider>
        <Router>
          <PrimarySearchAppBar />
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/skillsdetails" element={<SkillsDetails />} />
              <Route path="/createskills" element={<CreateSkills />} />
              <Route path="/leavesdetails" element={<LeavesDetails />} />
              <Route path="/applyleave" element={<ApplyLeave />} />
              <Route path="/leaverequests" element={<LeaveRequests />} />
              <Route path="/holidayslist" element={<Holidays />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/ChangePassword" element={<ChangePassword />} />
              <Route path="/ReportingManager" element={<ReportingManagerSCreen />} />
              <Route path="/ChangeTheme" element={<ThemeChange />} />
              <Route path="/ShiftTimings" element={<ShifttimingsDetails />} />
              <Route path="/createProfile" element={<CreateProfile />} />
              <Route path="/UpdateEmployeeData" element={<UpdateEmpData />} />
            </Routes>
          </Suspense>
        </Router>
        </UserProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
