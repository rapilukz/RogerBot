import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export const getToken = async () => {
  const url = process.env.GET_TOKEN_URL;
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const grant_type = 'client_credentials';

  const response = await axios.post(url, {
    client_id,
    client_secret,
    grant_type,
  });

  return response.data.access_token;
};

export const getChannels = async (token: string) => {};
