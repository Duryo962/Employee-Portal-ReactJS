import axios from 'axios';
import { Url } from '../../Components/ENV Values/envValues';

// Get current employee leave datilsa
export const getEmployeeLeaveDetails = async (empId) => {
      try {
              const response = await axios.get(`${Url}/api/v1/leaves/GetLeaveDetailsByEmpId/${empId}`);
              return response.data;
      } catch (error) {
              console.log('API request failed:', error);
              throw error;
      }
};

// Get types of leves from DB
export const getLeaveType = async () => {
      try {
              const response = await axios.get(`${Url}/api/v1/namevaluepair/GetByTye/LeaveType`);
              return response.data;
      } catch (error) {
              console.log('API request failed:', error);
              throw error;
      }
};

// Insert leave
export const insertLeave=async (body)=>{
      try{
              const res=await axios.post(`${Url}/api/v1/leaves/InsertLeave`,body)
              return res.data;
      }
      catch(e)
      {
              return e;
      }
};

// Send leave details  through mail
export const SendLeaveMail=async (body)=>{

    try{
              const res=await axios.post(`${Url}/api/v1/mail/send`, null, { params: body,})
              return res.data;
    }
    catch(e)
    {
             return e;
    }
};

// Get pending leave requeest details
export const leaveRequestDetails=async (designation)=>{

      try{
              const res=await axios.get(`${Url}/api/v1/leaves/reportingManager/${designation}/status/Pending`)
              return res.data;
      }
      catch(e)
      {
              return e;
      }
};

// Update Leave status
export const UpdateLeaveStatus=async (uniqueNumber,leaveStatus)=>{
  
      try {
              const res = await axios.put( `${Url}/api/v1/leaves/uniqueNumber/${uniqueNumber}/status/${leaveStatus}`,);
              return res.data;
      } catch (e) {
              return e;
      }
};

// get leave days
export const getleaveDay = async () => {
        try {
                const response = await axios.get(`${Url}/api/v1/namevaluepair/GetByTye/LeaveDays`);
                return response.data;
        } catch (error) {
                console.log('API request failed:', error);
                throw error;
        }
};