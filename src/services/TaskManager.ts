import * as vscode from "vscode";
import { runCommand } from "../extension";

export interface CommandType {
  type: string;
  uri: vscode.Uri;
  command: string;
}

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
    runCommand(command);
  }

  clean() {
    this.tasks = [];
  }
}

export default new TaskManager();
