import axios from "axios"
import { Url } from "../../Components/ENV Values/envValues";

export const getShiftTimingsByEmployeeId=async(employeeID)=>{
    try{
            const shiftTimings=await axios.get(`${Url}/api/v1/shiftTimings/TimingsById/${employeeID}`);
            return shiftTimings.data;
        }
    catch(e)
        {
            console.log("Error To Fetching Shift Timings")
        }
}

export const insertShiftimings=async(body)=>{
    try{
            const shiftTimingsInsertResult=await axios.post(`${Url}/api/v1/shiftTimings/InsetShiftDetails`,body);
            return shiftTimingsInsertResult.data;
        }
    catch(e)
        {
            console.log("Error To Insert Shift Timings")
        }
}

export const updateShiftimings=async(id,body)=>{
    try{
            const shiftTimingsUpdateResult=await axios.put(`${Url}/api/v1/shiftTimings/UpdatebyId/${id}`,body);
            return shiftTimingsUpdateResult.data;
        }
    catch(e)
        {
            console.log("Error To Update Shift Timings")
        }
}

export const deleteShiftimings=async(id)=>{
    try{
            const shiftTimingsdeleteResult=await axios.delete(`${Url}/api/v1/shiftTimings/DeleteShift/${id}`);
            return shiftTimingsdeleteResult.data;
        }
    catch(e)
        {
           return e;
        }
}

export const getShiftsByEmplyeeId=async(id)=>{
    try{
            const shiftTimingsResult=await axios.get(`${Url}/api/v1/shiftTimings/FetchingShiftsById/${id}`);
            return shiftTimingsResult.data;
        }
    catch(e)
        {
           return e;
        }
}

export const getShiftsByEmplyeeName=async(empName)=>{
    try{
            const shiftTimingsResult=await axios.get(`${Url}/api/v1/shiftTimings/FetchingShiftsByName/${empName}`);
            return shiftTimingsResult.data;
        }
    catch(e)
        {
           return e;
        }
}
export const getShiftsByEmplyeeNameAndId=async(id,empName)=>{
    try{
            const shiftTimingsResult=await axios.get(`${Url}/api/v1/shiftTimings/FetchingShiftsByIdAndName/${id}/${empName}`);
            return shiftTimingsResult.data;
        }
    catch(e)
        {
           return e;
        }
}
