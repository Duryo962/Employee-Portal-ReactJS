import axios from 'axios'
import { Url } from '../../Components/ENV Values/envValues';

// Get Work Details
export const getWorkingDetails = async () => {
      try 
            {
                  const response = await axios.get(`${Url}/api/v1/namevaluepair/GetByTye/Working`);
                  return response.data;
            } 
      catch (error) 
            {
                  console.error('API request failed:', error);
                  throw error;
            }
};

// Get Skills Names
export const getSkills = async () => {
      try   {
                  const response = await axios.get(`${Url}/api/v1/namevaluepair/GetByTye/Skills`);
                  return response.data;
            } 
      catch (error) 
            {
                  console.error('API request failed:', error);
                  throw error;
            }
};

// Get current employee skills
export const getEmployeeSkills=async(empId)=>{
      try   {
                const empSkills = await axios.get(`${Url}/api/v1/skills/GetSkillsById/${empId}`);
                return empSkills.data;
            }    
      catch (e) 
            {
                console.log("Employee Skills Fetching API Failed ", e);
                return e;
            }
        
};

// Update current employee  selected skill
export const updateEmployeeSkills=async(id,data)=>{

      try   {
              const res=await axios.put(`${Url}/api/v1/skills/UpdateSkills/${id}`,data)
              return res.data;
            }
      catch(e)
            {
              console.error('Error updating employee skills:', e);
              return e;
            }
};

// Insert skill into current employee skill data
export const insertSkill=async (body)=>{
      try   {
                  const res=await axios.post(`${Url}/api/v1/skills/InsertSklls`,body)
                  return res.data;
            }
      catch(e)
            {
                  return e;
            }
};

export const deleteSkill=async (id)=>{
      try   {
                  const deleteSkillRes=await axios.delete(`${Url}/api/v1/skills/DeleteSkill/${id}`)
                  return deleteSkillRes.data;
            }
      catch(e)
            {
                  return e;
            }
};
