import Service from "./service.js";

const data = {
  username: `gustavo-${Date.now()}`,
  password: 'senhasecreta'
}

const service = new Service({
  filename: './users.ndjson'
});

// await service.create(data);

const timestampInicio = Date.now();
const users = await service.read();
const timestampFim = Date.now();

const seconds = (timestampFim - timestampInicio) / 1000;

console.log('users', users);
console.log('seconds to read: ', seconds);