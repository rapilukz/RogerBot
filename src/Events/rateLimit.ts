import { Event } from '../Interfaces'; 

export const event: Event = {
    name: 'rateLimit',
    run: async (client) => {
        console.log('Rate limit reached!');
    }
}