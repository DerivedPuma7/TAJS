import { describe, it, expect, jest, beforeAll, afterAll } from "@jest/globals";

function waitForServerStatus(server) {
  return new Promise((resolve, reject) => {
    server.once('error', (err) => reject(err));
    server.once('listening', () => resolve());
  });
}

describe("E2E Test Suite", () => {
  describe("E2E Tests for Server", () => {
    let testServer;
    let testServerAddress;

    beforeAll(async () => {
      process.env.NODE_ENV = 'test';
      const { default: server } = await import ("../src/index.js");
      testServer = server.listen();
      
      await waitForServerStatus(testServer);
      const serverInfo = testServer.address();
      testServerAddress = `http://localhost:${serverInfo.port}`;
    });

    // afterAll(done => testServer.close(done));
    afterAll(() => {
      testServer.close();
    });

    it("should return 404 for unsupported routes", async () => {
      const response = await fetch(`${testServerAddress}/unsupported`, {
        method: 'POST'
      });

      expect(response.status).toBe(404);
    });

    it("should return 400 and error message when body is missing cpf", async () => {
      const invalidPerson = { name: "any name" };
      
      const response = await fetch(`${testServerAddress}/persons`, {
        method: 'POST',
        body: JSON.stringify(invalidPerson)
      });

      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data).toEqual({
        validationError: 'cpf is required'
      });
    });

    it("should return 400 and error message when body is missing name", async () => {
      const invalidPerson = { cpf: "123.123.123-23" };
      
      const response = await fetch(`${testServerAddress}/persons`, {
        method: 'POST',
        body: JSON.stringify(invalidPerson)
      });

      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data).toEqual({
        validationError: 'name is required'
      });
    });

    it("should return 400 and error message when full name is not given", async () => {
      const invalidPerson = { name: "anyname", cpf: "123.123.123-23" };
      
      const response = await fetch(`${testServerAddress}/persons`, {
        method: 'POST',
        body: JSON.stringify(invalidPerson)
      });

      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data).toEqual({
        validationError: `cannot save invalid person: {"cpf":"12312312323","name":"anyname","lastName":""}`
      });
    });

    it("should return 200 for valid request", async () => {
      const invalidPerson = { name: "any name", cpf: "123.123.123-23" };
      
      const response = await fetch(`${testServerAddress}/persons`, {
        method: 'POST',
        body: JSON.stringify(invalidPerson)
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data).toEqual({
        personFormated: {
          cpf: "12312312323",
          lastName: "name",
          name: "any",
        },
        status: "ok"
      });
    });
  });

  describe("E2E Tests for Server in a non-test env", () => {
    it.skip('should start server with port 4000', async() => {
      const PORT = 4000;
      process.env.NODE_ENV = 'production';
      process.env.PORT = PORT;

      const { default: server } = await import ("../src/index.js");
      await waitForServerStatus(server);
      const serverInfo = server.address();

      expect(serverInfo.port).toBe(4000);

      process.env.NODE_ENV = 'test';
      return new Promise(resolve => server.close(resolve));
    }, 8000);
  });

});
