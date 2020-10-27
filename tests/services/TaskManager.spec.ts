import TaskManager, { TERMINAL_NAME } from "../../src/services/TaskManager";
import { window } from "vscode";
import { mocked } from "ts-jest/utils";

const mockedCreateTerminal = mocked(window.createTerminal);

describe("TaskManager", () => {
  afterEach(() => {
    TaskManager.clean();
    jest.clearAllMocks();
  });

  it("will run a new task and add it to the tasks", () => {
    const command = "run-this";
    const uri: any = {};
    const type = "test-type";

    TaskManager.runTask(command, uri, type);

    expect(window.createTerminal).toHaveBeenCalledTimes(1);
    expect(window.createTerminal).toHaveBeenCalledWith(TERMINAL_NAME);
    expect(TaskManager.tasks).toEqual([
      expect.objectContaining({
        command,
        uri,
        type,
      }),
    ]);
  });

  it("will not add the same task to the list", () => {
    const command = "run-this";
    const uri: any = {};
    const type = "test-type";

    TaskManager.runTask(command, uri, type);
    TaskManager.runTask(command, uri, type);

    expect(TaskManager.tasks).toHaveLength(1);
    expect(TaskManager.tasks).toEqual([
      expect.objectContaining({
        command,
        uri,
        type,
      }),
    ]);
    expect(window.createTerminal).toHaveBeenCalledTimes(2);
    expect(window.createTerminal).toHaveBeenCalledWith(TERMINAL_NAME);
  });

  it("will rerun a command at index", () => {
    const mockTerminal: any = {
      show: jest.fn(),
      sendText: jest.fn(),
    };

    mockedCreateTerminal.mockImplementationOnce(() => mockTerminal);

    const task1: any = { command: "task1", uri: {}, type: "test-type-1" };
    const task2: any = { command: "task2", uri: {}, type: "test-type-2" };
    TaskManager.tasks = [task1, task2];

    TaskManager.rerunByIndex(1);
    expect(window.createTerminal).toHaveBeenCalledTimes(1);
    expect(window.createTerminal).toHaveBeenCalledWith(TERMINAL_NAME);
    expect(mockTerminal.show).toHaveBeenCalledTimes(1);
    expect(mockTerminal.sendText).toHaveBeenCalledTimes(1);
    expect(mockTerminal.sendText).toHaveBeenCalledWith(`clear && ${task2.command}`);
  });

  it("will rerun lastCommand", () => {
    const mockTerminal: any = {
      show: jest.fn(),
      sendText: jest.fn(),
    };

    mockedCreateTerminal.mockImplementationOnce(() => mockTerminal);

    const task1: any = { command: "task1", uri: {}, type: "test-type-1" };
    const task2: any = { command: "task2", uri: {}, type: "test-type-2" };
    TaskManager.tasks = [task1, task2];

    TaskManager.rerunLast();
    expect(window.createTerminal).toHaveBeenCalledTimes(1);
    expect(window.createTerminal).toHaveBeenCalledWith(TERMINAL_NAME);
    expect(mockTerminal.show).toHaveBeenCalledTimes(1);
    expect(mockTerminal.sendText).toHaveBeenCalledTimes(1);
    expect(mockTerminal.sendText).toHaveBeenCalledWith(`clear && ${task1.command}`);
  });
});
