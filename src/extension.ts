import * as vscode from "vscode";
import { runLast } from "./commands/run-last";
import { run } from "./commands/run";
import { runHistory } from "./commands/run-history";

const COMMAND_PREFIX = "test-runner";

export function activate(context: vscode.ExtensionContext) {
  const disposables = [];

  disposables.push(vscode.commands.registerCommand(`${COMMAND_PREFIX}.run`, run));
  disposables.push(vscode.commands.registerCommand(`${COMMAND_PREFIX}.runLast`, runLast));
  disposables.push(vscode.commands.registerCommand(`${COMMAND_PREFIX}.runHistory`, runHistory));

  context.subscriptions.push(...disposables);
}

export function deactivate() {
  //Noop
}
