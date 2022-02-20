import { Client } from 'discord.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

class Twitch{
    private Token : Promise<String>;
    private client_id = process.env.CLIENT_ID;
    private client_secret = process.env.CLIENT_SECRET;
    private Client: Client;

    constructor(client: Client){
        this.Client = client;
        this.Token = this.getToken();
    }

    private async getToken(): Promise<string>{
        const url = process.env.GET_TOKEN_URL;
        const grant_type = 'client_credentials';

        const response = await axios.post(url, {    
            client_id: this.client_id,
            client_secret: this.client_secret,
            grant_type,
          });
        
          return response.data.access_token;
    }
    
}

export default Twitch;