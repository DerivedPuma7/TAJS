import { BeforeStep, When, Then } from "@cucumber/cucumber";
import assert from "node:assert";

let testServerAddress = '';
let context = {};

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

BeforeStep(function () {
  testServerAddress = this.testServerAddress;
});

When('I create a new user with the following details:', async function (dataTable) {
  const [data] = dataTable.hashes();
  const response = await createUser(data);
  assert.strictEqual(response.status, 201);
  context.userData = await response.json();
  assert.ok(context.userData.id);
});

Then('I request the API with the user\'s ID', async function(){
  const user = await findUserById(context.userData.id);
  context.createdUserData = user;
});

Then('I should receive a JSON response with the user\'s details', async function() {
  const expectedKeys = [ 'name', 'birthday', 'id', 'category' ];
  assert.deepStrictEqual(
    Object.keys(context.createdUserData).sort(),
    expectedKeys.sort()
  );
});

Then("The user\'s category should be {string}", async function(category) {
  assert.strictEqual(context.createdUserData.category, category);
});