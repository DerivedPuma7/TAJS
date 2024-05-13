import Service from "../src/service.js";

import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import fs from "node:fs/promises";
import crypto from "node:crypto";

describe("Service", () => {
  let service;
  const filename = 'testefile.ndjson';
  const mockedPassword = "any password hash";

  beforeEach(() => {
    jest.spyOn(crypto, "createHash").mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue(mockedPassword)
    });
    jest.spyOn(fs, 'appendFile').mockResolvedValue();
    service = new Service({ filename });
  });

  describe("#create - spies", () => {
    it("should call appendFile with correct params", async () => {
      const input = { username: "user 1", password: "password 1" };
      const mockedCreatedAt = new Date().toISOString();
      jest.spyOn(Date.prototype, "toISOString").mockReturnValue(mockedCreatedAt);

      service.create(input);

      expect(crypto.createHash).toHaveBeenCalledWith('sha256');
      expect(crypto.createHash).toHaveBeenCalledTimes(1);

      const hash = crypto.createHash('sha256');
      expect(hash.update).toHaveBeenCalledWith(input.password);
      expect(hash.update).toHaveBeenCalledTimes(1);
      
      expect(hash.digest).toHaveBeenCalledWith('hex');
      expect(hash.digest).toHaveBeenCalledTimes(1);

      const expected = JSON.stringify({
        ...input, 
        createdAt: mockedCreatedAt,
        password: mockedPassword
      }).concat('\n');

      expect(fs.appendFile).toHaveBeenCalledWith(filename, expected);
    });
  });
});
