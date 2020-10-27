import * as vscode from "vscode";
import { runLast } from "./commands/run-last";
import { run } from "./commands/run";
import { runHistory } from "./commands/run-history";
import { CommandType } from "./services/TaskManager";

const COMMAND_PREFIX = "test-runner";

let globalCommand: CommandType | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
  const disposables = [];

  disposables.push(vscode.commands.registerCommand(`${COMMAND_PREFIX}.run`, run));
  disposables.push(vscode.commands.registerCommand(`${COMMAND_PREFIX}.runLast`, runLast));
  disposables.push(vscode.commands.registerCommand(`${COMMAND_PREFIX}.runHistory`, runHistory));

  disposables.push(
    vscode.tasks.registerTaskProvider("testrunner", {
      provideTasks: () => {
        if (!globalCommand) {
          return [];
        }
        return [
          new vscode.Task(
            { type: "testrunner", task: "run" },
            2,
            "run",
            "testrunner",
            new vscode.ShellExecution(globalCommand.command),
          ),
        ];
      },
      resolveTask: () => undefined,
    }),
  );

  context.subscriptions.push(...disposables);
}

export async function runCommand(command: CommandType) {
  setGlobalCommand(command);

  vscode.window.activeTextEditor || vscode.window.showErrorMessage("Open a test file to run it.");

  await vscode.commands.executeCommand("workbench.action.terminal.clear");
  await vscode.commands.executeCommand("workbench.action.tasks.runTask", "testrunner: run");
}

export function setGlobalCommand(command: CommandType) {
  globalCommand = command;
}

export function deactivate() {
  //Noop
}
