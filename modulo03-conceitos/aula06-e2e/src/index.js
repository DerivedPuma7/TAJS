import server from "./server.js";
import { routes } from './routes.js';

function bootstrap() {
  if(process.env.NODE_ENV === 'test') return;
  
  server.listen(process.env.PORT, () => {
    const serverInfo = server.address();
    console.log(`
      server is runnig at ${serverInfo.address}:${serverInfo.port}
    `);
    console.log(`know routes: \n`);
    routes.forEach((value, key, map) => {
      console.log(key);
    });
  });
}

bootstrap();

export default server;

/*
  curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "gustavo figueiredo",
    "cpf": "123.123.123-23"
  }' \
  http://localhost:3000/persons
 */