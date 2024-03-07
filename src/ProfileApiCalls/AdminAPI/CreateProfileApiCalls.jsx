import axios from 'axios';
import { Url } from '../../Components/ENV Values/envValues';

export const getNameValurPairByType = async (type) => {
    try {
            const designationList = await axios.get(`${Url}/api/v1/namevaluepair/GetByTye/${type}`);
            return designationList.data;
    } catch (error) {
            return error;
    }
};

export const getWorkFromLocationList = async () => {
    try {
            const workFromLocationList = await axios.get(`${Url}/api/v1/namevaluepair/GetByTye/Workfromlocation`);
            return workFromLocationList.data;
    } catch (error) {
            return error;
    }
};

export const getShiftTimisList = async () => {
    try {
            const shiftTimisList = await axios.get(`${Url}/api/v1/namevaluepair/GetByTye/Shifttimings`);
            return shiftTimisList.data;
    } catch (error) {
            return error;
    }
};

export const sendWelcomeMail = async (employeeId,employeeame,emailID,password,designation) => {
        try {
                const WelcomeMailRes = await axios.post(`${Url}/api/v1/mail/SendWelcomeMail/${employeeId}/${employeeame}/${emailID}/${password}/${designation}`);
                return WelcomeMailRes.data;
        } catch (error) {
                return error;
        }
};

export const CreateUserCredentials = async (usercredentials) => {
        try {
                const createuserApiRes = await axios.post(`${Url}/api/v1/users/InsertUser`,usercredentials);
                return createuserApiRes.data;
        } catch (error) {
                return error;
        }
};