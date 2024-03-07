import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { timeOutInMinutes } from '../ENV Values/envValues';


function TimerComponent() {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    const handleActivity = () => {
      setTimer(0);
    };

    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keydown', handleActivity);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keydown', handleActivity);
    };
  }, []);

  useEffect(() => {
    if (timer >= timeOutInMinutes*60) {
      navigate('/login',{replace:true});
      localStorage.removeItem('userId');
      localStorage.removeItem('profileFetched');
    }
  }, [timer, navigate]);

 
}

export default TimerComponent;
