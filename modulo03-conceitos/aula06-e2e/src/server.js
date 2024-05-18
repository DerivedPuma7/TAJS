import { createServer } from 'node:http';
import { routes } from './routes.js';

const server = createServer(async (request, response) => {
  const route = `[${request.method}] ${request.url}`;

  if(!routes.has(route)) {
    return response.writeHead(404).end('Not Found');
  }
  
  return routes.get(route)(request, response);
});

export default server;

/*
  curl \
  -i \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "gustavo figueiredo",
    "cpf": "123.123.123-23"
  }' \
  http://localhost:3000/persons
*/