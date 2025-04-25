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

// Get all tickets for a user
const getTickets = async (token) => {
  const response = await axios.get(API_URL + 'tickets', getConfig(token));
  return response.data;
};

// Get a single ticket
const getTicket = async (ticketId, token) => {
  const response = await axios.get(
    API_URL + `tickets/${ticketId}`,
    getConfig(token)
  );
  return response.data;
};

// Create new ticket
const createTicket = async (hospitalId, ticketData, token) => {
  const response = await axios.post(
    API_URL + `hospitals/${hospitalId}/tickets`,
    ticketData,
    getConfig(token)
  );
  return response.data;
};

// Update ticket
const updateTicket = async (ticketId, ticketData, token) => {
  const response = await axios.put(
    API_URL + `tickets/${ticketId}`,
    ticketData,
    getConfig(token)
  );
  return response.data;
};

// Delete ticket
const deleteTicket = async (ticketId, token) => {
  const response = await axios.delete(
    API_URL + `tickets/${ticketId}`,
    getConfig(token)
  );
  return response.data;
};

const ticketService = {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket
};

export default ticketService;