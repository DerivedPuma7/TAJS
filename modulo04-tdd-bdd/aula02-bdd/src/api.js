import { createServer } from "node:http";
import { once } from "node:events"
import { randomUUID } from "node:crypto";

const usersDb = [];

export const server = createServer(async (request, response) => {
  try {
    if(request.url === '/users' && request.method === 'POST') {
      const user = JSON.parse(await once(request, 'data'));
      const updatedUser = {
        ...user,
        id: randomUUID(),
        category: getUserCategory(user.birthday)
      };
      usersDb.push(updatedUser);
      response
        .writeHead(201, {
          'Content-Type': 'application/json'
        })
        .end(JSON.stringify({
          id: updatedUser.id
        }));
      return;
    }
  
    if(request.url.startsWith('/users') && request.method === 'GET') {
      const [ ,, id] = request.url.split('/');
      const user = usersDb.find(user => user.id === id);
      
      response
        .writeHead(200, {
          'Content-Type': 'application/json'
        })
        .end(JSON.stringify(user));
      return;
    }
  } catch(error) {
    if(error.message.includes('18yo')) {
      response
        .writeHead(400, {
          'Content-Type': 'application/json'
        })
        .end(JSON.stringify({
          message: error.message
        }));
      return;
    }
    response.writeHead(500).end('kaboom');
    return;
  }
  response.end('unsupported route');
});

function getUserCategory(birthday) {
  console.log(birthday);
  const age = new Date().getFullYear() - new Date(birthday).getFullYear();
  if(age < 18) {
    throw new Error ("user must be older than 18yo");
  }
  if(age >= 51) {
    return 'senior'
  }
  if(age >= 18 && age <= 25){
    return 'young-adult';
  }
  if(age >= 26 && age <= 50) {
    return 'adult'
  }
  return '';
}