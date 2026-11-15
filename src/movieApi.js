import axios from 'axios';

// I keep the server address here so Read and Create use the same one.
// I wait up to ten seconds before treating a request as timed out.
const movieApi = axios.create({ baseURL: 'http://localhost:4000', timeout: 10000 });

// I export this client so both pages share the same request settings.
export { movieApi };
