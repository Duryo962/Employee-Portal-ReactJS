import axios from 'axios';
import { Url } from '../../Components/ENV Values/envValues';

// Get holidays list by current year
export const getHolidaysList = async (year) => {
    try {
            const response = await axios.get(`${Url}/api/v1/holidays/fetchByYear/${year}`);
            return response.data;
    } catch (error) {
            console.log('API request failed:', error);
            throw error;
    }
};