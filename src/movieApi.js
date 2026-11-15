// I use Axios to make the requests to my Express server.
import axios from 'axios';

// I keep the server address here so Read and Create use the same one.
// I wait up to ten seconds before treating a request as timed out.
// I use localhost because the frontend and API run on the same computer in this lab.
// I put the route, such as /api/movies, in each request rather than in baseURL.
const movieApi = axios.create({ baseURL: 'http://localhost:4000', timeout: 10000 });

// I export this client so both pages share the same request settings.
export { movieApi };
