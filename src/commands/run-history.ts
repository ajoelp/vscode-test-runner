import * as vscode from "vscode";
import * as path from "path";
import TaskManager from "../services/TaskManager";

export async function runHistory() {
  const task = await vscode.window.showQuickPick(
    TaskManager.tasks.map((task, index) => {
      const file = path.basename(task.uri.toString());
      return {
        label: file,
        description: task.type,
        index,
      };
    }),
  );

  if (!task) {
    return;
  }

  TaskManager.rerunByIndex(task.index);
}
