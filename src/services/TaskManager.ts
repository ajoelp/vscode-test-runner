import * as vscode from "vscode";

export interface CommandType {
  type: string;
  uri: vscode.Uri;
  command: string;
}

export const TERMINAL_NAME = "testrunner";

class TaskManager {
  tasks: CommandType[] = [];

  runTask(commandValue: string, uri: vscode.Uri, type: string) {
    const command = {
      type,
      uri,
      command: commandValue,
    };

    const [mostRecentCommand] = this.tasks.length > 0 ? this.tasks : [null];

    if (!mostRecentCommand || mostRecentCommand.command !== commandValue) {
      this.tasks.unshift(command);
    }

    this.runCommand(command);
  }

  rerunLast() {
    if (this.tasks.length < 1) {
      return;
    }
    const [mostRecent] = this.tasks;
    this.runCommand(mostRecent);
  }

  rerunByIndex(index: number) {
    const command = this.tasks[index];
    this.runCommand(command);
  }

  runCommand(command: CommandType) {
    let terminal = this.getTerminal();
    if (!terminal) {
      terminal = vscode.window.createTerminal(TERMINAL_NAME);
    }

    terminal.show();
    terminal.sendText(`clear && ${command.command}`);
    //TODO: focus on the editor again.
  }

  clean() {
    this.tasks = [];
  }

  private getTerminal() {
    return vscode.window.terminals.find((terminal) => terminal.name === TERMINAL_NAME);
  }
}

export default new TaskManager();
