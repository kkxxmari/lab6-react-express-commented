import axios from 'axios';

// Share the API address between the GET and POST calls.
// The timeout lets either page report an error if a request stalls.
const movieApi = axios.create({ baseURL: 'http://localhost:4000', timeout: 10000 });

export { movieApi };
