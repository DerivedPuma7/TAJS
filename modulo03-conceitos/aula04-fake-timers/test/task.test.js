import Task from "../src/task.js";

import { setTimeout } from "node:timers/promises"
import { it, expect, describe, beforeEach, beforeAll, jest } from "@jest/globals";


describe("Task Test Suite", () => {
  const oneSecond = 1000;
  let logMock;
  let tasks;
  let sut;

  beforeAll(() => {
    tasks = [
      { 
        name: 'task-will-run-in-5-secs',
        dueAt: new Date(Date.now() + oneSecond * 5),
        fn: jest.fn()
      },
      { 
        name: 'task-will-run-in-10-secs',
        dueAt: new Date(Date.now() + oneSecond * 10),
        fn: jest.fn()
      }
    ];
  });

  beforeEach(() => {
    logMock = jest.spyOn(console, "log").mockImplementation();
    sut = new Task();
    sut.save(tasks[0]);
    sut.save(tasks[1]);
  });

  it.skip("should only run tasks that are due without fake timers (slow)", async () => {
    sut.run(200);
    await setTimeout(11000);

    expect(tasks.at(0).fn).toHaveBeenCalled();
    expect(tasks.at(1).fn).toHaveBeenCalled();
  },
  // configurar para o jest aguardar 15 segundos nesse test
  15000
  );

  it("should only run tasks that are due with fake timers (fast)", async () => {
    jest.useFakeTimers();
    
    sut.run(200);

    jest.advanceTimersByTime(4000); // avançamos 4 segundos no tempo
    expect(tasks.at(0).fn).not.toHaveBeenCalled();
    expect(tasks.at(1).fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000); // avançamos mais 2 segundos no tempo = 6 segundos
    expect(tasks.at(0).fn).toHaveBeenCalled();
    expect(tasks.at(1).fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(4000); // avançamos mais 4 segundos no tempo = 10 segundos
    expect(tasks.at(1).fn).toHaveBeenCalled();

    jest.useRealTimers();
  });
});
