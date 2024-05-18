import { Person, AppError }  from './person.js';

import { once } from 'node:events';

export const routes = new Map();

routes.set('[POST] /persons', async (req, res) => {
  try {
    const data = (await once(req, 'data')).toString();
    const result = Person.process(JSON.parse(data));
    return res.end(JSON.stringify(result));
  } catch (error) {
    if(error instanceof AppError) {
      res
        .writeHead(400)
        .write(JSON.stringify({ validationError: error.message }))
      res.end();
      return;
    }
    console.log("Error: ", error);
    res.writeHead(500)
    res.end();
  }
});
