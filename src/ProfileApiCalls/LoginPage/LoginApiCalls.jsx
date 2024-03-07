import axios from "axios"
import { Url } from "../../Components/ENV Values/envValues"

// Get password by employee id
export const getPasswordById=async(empId)=>{
    try{
            const userDetails=await axios.get(`${Url}/api/v1/users/FetchByUserId/${empId}`);
            return userDetails.data;
        }
    catch(e)
        {
            console.log("Error in fetching userDetails : ",e);
            return e;
        }
};

// Send email vaerification code 
export const sendMailVerificationCode=async(employeeID,email,randomNumber)=>{
        try   {
                const verificationCodeDetails=await axios.post(`${Url}/api/v1/mail/SendVerificationCode/${employeeID}/${email}/${randomNumber}`);
                return verificationCodeDetails.data;
              }
        catch(e)
              {
                console.log("Error to send Email Verification Code");
                return '';
              }
};

// Update Password
export  const updatePassword=async(employeeID,Password)=>{
        try{
                const UpdatePasswordResult=await axios.patch(`${Url}/api/v1/users/UpdatePassword/${employeeID}/${Password}`);
                return UpdatePasswordResult.data;
        }
        catch(e)
        {       console.log("Error to Update Password : ",e);
                return 'Error to Update Password';
        }
};