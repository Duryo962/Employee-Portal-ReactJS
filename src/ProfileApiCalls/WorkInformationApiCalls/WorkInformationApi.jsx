import axios from "axios"
import { Url } from "../../Components/ENV Values/envValues"

// Get current employee reporting manager details
export const getReportingManagerById=async(employeeID)=>{
    try
        {
            const managerDetails=await axios.get(`${Url}/api/v1/reportingManager/FindByEmployeeId/${employeeID}`);
            return managerDetails.data;
        }
    catch(e)
        {
            return e;
        }
}

// Update current employee selected reporting manager details
export const UpdateReportingManagerById=async(body)=>{
    try
        {
            const updateresult=await axios.put(`${Url}/api/v1/reportingManager/UpdateById`,body);
            return updateresult.data;
        }
    catch(e)
        {
            console.log("Unable to update reportingManager");
            return e;
        }
}

export const createReportingManager=async(body)=>{
    try
    {
        const createManagerRes=axios.post(`${Url}/api/v1/reportingManager/CreateRm`,body);
        return (await createManagerRes).data;
    }
    catch(e)
    {
        return e;
    }
}

export const deletereportingManager=async(id)=>{
    try{
        const deleteRmResult=axios.delete(`${Url}/api/v1/reportingManager/DeleteRm/${id}`);
        return (await deleteRmResult).data;
    }
    catch(e)
    {
        return e;
    }
}

export const getReportingManagerByEmployeeId=async(employeeID)=>{
    try
        {
            const managerDetails=await axios.get(`${Url}/api/v1/reportingManager/FindAllByEmployeeId/${employeeID}`);
            return managerDetails.data;
        }
    catch(e)
        {
            return e;
        }
}
export const getReportingManagerByEmployeeName=async(employeeName)=>{
    try
        {
            const managerDetails=await axios.get(`${Url}/api/v1/reportingManager/FindAllByEmployeeName/${employeeName}`);
            return managerDetails.data;
        }
    catch(e)
        {
            return e;
        }
}
export const getReportingManagerByEmployeeNameAndName=async(employeeId,employeeName)=>{
    try
        {
            const managerDetails=await axios.get(`${Url}/api/v1/reportingManager/FindAllByEmployeeNameAndId/${employeeId}/${employeeName}`);
            return managerDetails.data;
        }
    catch(e)
        {
            return e;
        }
}