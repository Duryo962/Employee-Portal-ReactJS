import axios from 'axios'
import { Url } from '../../Components/ENV Values/envValues';

// Get current employee details
export const getProfileById = async (empId) => {
      try   {
                  const response = await axios.get(`${Url}/api/v1/profile/getProfileById/${empId}`);
                  const imageData = response.data;
                  if (imageData.data.imageUrl) {
                        imageData.data.imageUrl = `data:image/jpeg;base64,${imageData.data.imageUrl}`;
                  }
                  return imageData;
            } 
      catch (error) 
            {
                  console.log('API request failed:', error);
                  throw error;
            }
};

// Get All employees details
export const getEmployeesDetails = async () => {
      try   {
                  const response = await axios.get(`${Url}/api/v1/profile/EmployeeDetails`);
                  return response.data;
            } 
      catch (error) 
            {
                  console.log('API request failed:', error);
                  throw error;
            }
};

// Update current employe About 
export const UpdateAbout = async (empId,about) => {
      try   {
                  const response = await axios.put(`${Url}/api/v1/profile/employeeId/${empId}/about/${about}`);
                  return response.data;
            } 
      catch (error) 
            {
                  console.log('API request failed:', error);
                  throw error;
            }     
};

// Update current employee Image
export const UpdateImageUrl = async (employeeId, image) => {
      const formData = new FormData();
      formData.append('image', image);
      try   {
                  const response = await axios.put(`${Url}/api/v1/profile/updateImage/${employeeId}`, formData, {
                  headers: {
                        'Content-Type': 'multipart/form-data',
                  },
                  });
                  return response.data;
            } 
      catch (error) 
            {
                  console.log('Error uploading image:', error);
                  throw new Error('Failed to update image URL');
            }
};

// Get Current employee Email id
export const getEmailId=async(empID)=>{
      try   {
                  const email = await axios.get(`${Url}/api/v1/profile/FetchEmailID/${empID}`)
                  return email.data;    
            }
      catch(e)
            {
                  return e;
            }
};
   
// Update Theme Color
export const UpdateThemeColorByID=async(employeeId,themeColor)=>{
      try
      {
            const updatedColor = themeColor.replace(/#|\s/g, "");;
            const UpdateThemeApiRes = await axios.put(`${Url}/api/v1/profile/UpdateThemeColr/${employeeId}/${updatedColor}`);
            return UpdateThemeApiRes.data;
      }
      catch(e)
      {
            console.log("Unable to Update theme COlor")
      }
}

export const getAllEMployeesNames=async()=>{
      try   {
                  const AllEMployeesNames = await axios.get(`${Url}/api/v1/profile/GetAllUsersNames`)
                  return AllEMployeesNames.data;    
            }
      catch(e)
            {
                  return e;
            }
};

export const createEMployee=async(body)=>{
      try   {
                  const createEmployeeRes = await axios.post(`${Url}/api/v1/profile/InsertEmployee`,body)
                  return createEmployeeRes.data;    
            }
      catch(e)
            {
                  return e;
            }
};

export const getEmployeeDtaByIdAndName=async(id,name)=>{
      try   {
                  const EmployeeRes = await axios.post(`${Url}/api/v1/profile/GetUserDataByIdName/${id}/${name}`)
                  return EmployeeRes.data;    
            }
      catch(e)
            {
                  return e;
            }
};

export const getListOfEMployeesDatafromEmployeeID=async(id)=>{
      try   {
                  const EmployeeRes = await axios.get(`${Url}/api/v1/profile/FindEmployeesById/${id}`)
                  return EmployeeRes.data;    
            }
      catch(e)
            {
                  return e;
            }
};

export const getListOfEMployeesDatafromEmployeeName=async(name)=>{
      try   {
                  const EmployeeRes = await axios.get(`${Url}/api/v1/profile/FindEmployeesByName/${name}`)
                  return EmployeeRes.data;    
            }
      catch(e)
            {
                  return e;
            }
};

export const getListOfEMployeesDatafromEmployeeIdAndName=async(id,name)=>{
      try   {
                  const EmployeeRes = await axios.get(`${Url}/api/v1/profile/GetUserDataByIdName/${id}/${name}`)
                  return EmployeeRes.data;    
            }
      catch(e)
            {
                  return e;
            }
};
export const UpdateProfileById=async(body)=>{
      try   {
                  const EmployeeRes = await axios.put(`${Url}/api/v1/profile/UpdateEmployeeById`,body)
                  return EmployeeRes.data;    
            }
      catch(e)
            {
                  return e;
            }
};

export const UpdateProfileReportingManagerById=async(id,reportingManager)=>{
      try   {
                  const EmployeeRes = await axios.put(`${Url}/api/v1/profile/UpdateReportingManagerByEmpId/${id}/${reportingManager}`)
                  return EmployeeRes.data;    
            }
      catch(e)
            {
                  return e;
            }
};

export const UpdateProfileShiftTimingsById=async(id,shiftTimings)=>{
      try   {
                  const EmployeeRes = await axios.put(`${Url}/api/v1/profile/UpdateShiftTimesByEmpId/${id}/${shiftTimings}`)
                  return EmployeeRes.data;    
            }
      catch(e)
            {
                  return e;
            }
};




