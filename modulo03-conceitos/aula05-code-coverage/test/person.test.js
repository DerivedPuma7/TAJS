import { mapPerson } from "../src/person.js";

import { it, expect, describe } from "@jest/globals";

describe("Person Test Suite", () => {
  describe("happy path", () => {
    it("should map person", () => {
      const personStr = '{"name": "any name","age": 23}';

      const personObj = mapPerson(personStr);

      expect(personObj).toEqual({
        name: "any name",
        age: 23,
        createdAt: expect.any(Date)
      });
    });
  });

  describe("what coverage does not tell you", () => {
    it("should not map person given invalid json string", () => {
      const personStr = '{"name": ';

      const result = (() => mapPerson(personStr));

      expect(result).toThrow(new Error('Unexpected end of JSON input'));
    });

    it("should not map person given invalid json data", () => {
      const personStr = '{}';

      const personObj = mapPerson(personStr);

      expect(personObj).toEqual({
        name: undefined,
        age: undefined,
        createdAt: expect.any(Date)
      });
    });
  });
});