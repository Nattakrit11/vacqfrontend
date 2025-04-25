import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/';

// Create config with authorization headers
const getConfig = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all hospitals
const getHospitals = async () => {
  const response = await axios.get(API_URL + 'hospitals');
  return response.data;
};

// Get user's appointments
const getAppointments = async (token) => {
  const response = await axios.get(API_URL + 'appointments', getConfig(token));
  return response.data;
};

// Create new appointment
const createAppointment = async (hospitalId, appointmentData, token) => {
  const response = await axios.post(
    API_URL + `hospitals/${hospitalId}/appointments`,
    appointmentData,
    getConfig(token)
  );
  return response.data;
};

// Delete appointment
const deleteAppointment = async (appointmentId, token) => {
  const response = await axios.delete(
    API_URL + `appointments/${appointmentId}`,
    getConfig(token)
  );
  return response.data;
};

const appointmentService = {
  getHospitals,
  getAppointments,
  createAppointment,
  deleteAppointment
};

export default appointmentService;