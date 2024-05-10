import Person from "../src/person.js"

import { describe, it, expect, jest } from "@jest/globals";

/**
 * AAA
 * Arrange = preparar
 * Act = executar
 * Assert = validar
 */

describe("#Person suite", () => {
  describe("#validate", () => {
    it("should throw if name is not provided", () => {
      const error = new Error('name is required');
      const mockInvalidPerson = {
        name: null,
        cpf: 'any cpf'
      };

      const result = () => Person.validate(mockInvalidPerson);

      expect(result).toThrow(error);
    });

    it("should throw if cpf is not provided", () => {
      const error = new Error('cpf is required');
      const mockInvalidPerson = {
        name: 'any name',
        cpf: null
      };

      const result = () => Person.validate(mockInvalidPerson);

      expect(result).toThrow(error);
    });

    it("should not throw person is valid", () => {
      const mockInvalidPerson = {
        name: 'any name',
        cpf: 'any cpf'
      };

      const result = () => Person.validate(mockInvalidPerson);

      expect(result).not.toThrow();
    });

  });

  describe("#format", () => {
    it("should format person name and cpf", () => {
      const mockPerson = {
        name: "any any name",
        cpf: "000.111.222-33"
      };

      const result = Person.format(mockPerson);

      expect(result).toStrictEqual({
        name: "any",
        lastName: "any name",
        cpf: "00011122233"
      });
    });
  });

  describe("#save", () => {
    it("should throw if name is not provided", () => {
      const mockPerson = {
        cpf: "000.111.222-33",
        lastName: "any name"
      };
      const error = new Error(`cannot save invalid person: ${JSON.stringify(mockPerson)}`);

      const result = () => Person.save(mockPerson);

      expect(result).toThrow(error);
    });

    it("should throw if cpf is not provided", () => {
      const mockPerson = {
        name: "any name",
        lastName: "any last name",
      };
      const error = new Error(`cannot save invalid person: ${JSON.stringify(mockPerson)}`);

      const result = () => Person.save(mockPerson);

      expect(result).toThrow(error);
    });

    it("should throw if lastName is not provided", () => {
      const mockPerson = {
        name: "any name",
        cpf: "000.111.222-33",
      };
      const error = new Error(`cannot save invalid person: ${JSON.stringify(mockPerson)}`);

      const result = () => Person.save(mockPerson);

      expect(result).toThrow(error);
    });

    it("should not throw for valid person", () => {
      const mockPerson = {
        name: "any name",
        cpf: "any cpf",
        lastName: "any last name",
      };

      const result = () => Person.save(mockPerson);

      expect(result).not.toThrow();
    });
  });

  describe("#process", () => {
    it("should process a valid person", () => {
      //Arrange
      const mockPerson = {
        name: "any any name",
        cpf: "111.222.333-00"
      };
      jest.spyOn(Person, Person.validate.name).mockReturnValueOnce();
      jest.spyOn(Person, Person.format.name).mockReturnValueOnce({
        name: "any",
        lastName: "any name",
        cpf: "11122233300"
      });

      //Act
      const result = Person.process(mockPerson);

      //Assert
      expect(result).toStrictEqual('ok');
    });
  });
});