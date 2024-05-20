import { describe, it, expect, beforeAll, afterAll, jest } from "@jest/globals";
import { server } from "../src/api.js";

/**
 * Deve cadastrar usuários e definir um categoria:
 *  - Jovens adultos: usuários de 18-25 anos
 *  - Adultos: usuários de 26-50 anos
 *  - Idosos: 51+
 *  - Menor: throw error
 */


describe("API Users E2E Suite", () => {
  function waitForServerStatus(server) {
    return new Promise((resolve, reject) => {
      server.once('error', (err) => reject(err));
      server.once('listening', () => resolve());
    });
  }

  function createUser(data) {
    return fetch(`${testServerAddress}/users`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async function findUserById(id) {
    const user = await fetch(`${testServerAddress}/users/${id}`);
    return user.json();
  }

  let testServer;
  let testServerAddress;

  beforeAll(async () => {
    testServer = server.listen();
    
    await waitForServerStatus(testServer);
    const serverInfo = testServer.address();
    testServerAddress = `http://localhost:${serverInfo.port}`;
  });

  afterAll(() => {
    server.closeAllConnections();
    testServer.close();
  });

  it("should throw an error when registering a under-age user", async () => {
    const response = await createUser({
      name: 'any name',
      birthday: '2008-01-01T00:00:00'
    });
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result).toEqual({
      message: 'user must be older than 18yo'
    });
  });

  it("should register a new user with young-adult category", async () => {
    const expectedCategory = 'young-adult';
    const response = await createUser({
      name: 'any name',
      birthday: '2000-01-01T00:00:00'
    });
    const result = await response.json();

    expect(response.status).toBe(201);
    expect(result.id).not.toBeUndefined();

    const user = await findUserById(result.id);

    expect(user.category).toBe(expectedCategory);
  });
  it("should register a new user with adult category", async () => {
    const expectedCategory = 'adult';
    const response = await createUser({
      name: 'any name',
      birthday: '1995-01-01T00:00:00'
    });
    const result = await response.json();

    expect(response.status).toBe(201);
    expect(result.id).not.toBeUndefined();

    const user = await findUserById(result.id);

    expect(user.category).toBe(expectedCategory);
  });
  it("should register a new user with senior category", async () => {
    const expectedCategory = 'senior';
    const response = await createUser({
      name: 'any name',
      birthday: '1970-01-01T00:00:00'
    });
    const result = await response.json();

    expect(response.status).toBe(201);
    expect(result.id).not.toBeUndefined();

    const user = await findUserById(result.id);

    expect(user.category).toBe(expectedCategory);
  });
});