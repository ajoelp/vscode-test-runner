import TaskManager, { TERMINAL_NAME } from "./TaskManager";
import { window } from "vscode";
import { mocked } from "ts-jest/utils";
import { runCommand } from "../extension";

const mockedCreateTerminal = mocked(window.createTerminal);
const mockedRunCommand = mocked(runCommand);

jest.mock("../extension", () => ({
  runCommand: jest.fn(),
}));

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

    expect(runCommand).toHaveBeenCalledTimes(1);
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
    expect(runCommand).toHaveBeenCalledTimes(2);
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
    expect(runCommand).toHaveBeenCalledTimes(1);
    expect(runCommand).toHaveBeenCalledWith(task2);
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
    expect(runCommand).toHaveBeenCalledTimes(1);
    expect(runCommand).toHaveBeenCalledWith(task1);
  });
});
