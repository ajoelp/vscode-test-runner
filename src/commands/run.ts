import * as vscode from "vscode";
import JavascriptRunner from "../runners/javascript";
import PHPRunner from "../runners/php";

const RUNNERS = [JavascriptRunner, PHPRunner];

export async function run() {
  const document = vscode.window.activeTextEditor?.document;

  if (!document) {
    return;
  }

  for (const Runner of RUNNERS) {
    /**
     * TODO: Implement isTestFile more better
     */
    if (Runner.TYPES.includes(document.languageId) && (await Runner.isTestFile(document.uri))) {
      const runner = new Runner(document);

      runner.run();

      return;
    }
  }
}
