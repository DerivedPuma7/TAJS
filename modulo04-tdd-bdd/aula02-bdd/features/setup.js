import { server } from "../src/api.js";

import { Given, AfterAll } from "@cucumber/cucumber";
import sinon from "sinon";

let testServer;

function waitForServerStatus(server) {
  return new Promise((resolve, reject) => {
    server.once('error', (err) => reject(err));
    server.once('listening', () => resolve());
  });
}

AfterAll(done => {
  sinon.restore();
  server.closeAllConnections();
  testServer.close(done);
});

Given("I have a running server", async function() {
  if(testServer) return;
  testServer = server.listen();
  
  await waitForServerStatus(testServer);
  const serverInfo = testServer.address();
  this.testServerAddress = `http://localhost:${serverInfo.port}`;
});

Given("The current date is {string}", async function(date) {
  sinon.restore();
  const clock = sinon.useFakeTimers(new Date(date).getTime());
  this.clock = clock;
});