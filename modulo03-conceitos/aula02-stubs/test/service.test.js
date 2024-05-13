import Service from "../src/service.js";

import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import fs from "node:fs/promises";
import fsSync from "node:fs";

describe("Service", () => {
  let service;
  const fileName = 'testefile.ndjson';
  const dbData = [
    {
      username: "any name", password: "any password", createdAt: new Date().toISOString()
    },
    {
      username: "any name 2", password: "any password 2", createdAt: new Date().toISOString()
    }
  ];
  const fileContent = dbData.map(item => JSON.stringify(item).concat('\n')).join('');

  beforeEach(() => {
    jest.spyOn(fsSync, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFile").mockResolvedValue(fileContent);
    service = new Service(fileName);
  });

  describe("#read", () => {
    it("should return an empty array if file does not exists ", async () => {
      jest.spyOn(fsSync, "existsSync").mockReturnValueOnce(false);

      const result = await service.read();

      expect(result).toEqual([]);
    });

    it("should return an empty array if file is empty ", async () => {
      jest.spyOn(fs, "readFile").mockResolvedValueOnce('');

      const result = await service.read();

      expect(result).toEqual([]);
    });

    it("should return users without password if file contains users", async () => {
      const result = await service.read();

      const expected = dbData.map(({ password, ...rest }) => ({ ...rest }));
      expect(result).toEqual(expected);
    });
  });
});
