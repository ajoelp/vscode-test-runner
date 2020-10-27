import * as vscode from "vscode";
import TaskManager from "../services/TaskManager";

const DESCRIBE_BLOCK_REGEX = /describe\(['|"](.*)['|"]/;

const JEST_PATH = "./node_modules/.bin/jest";

export default class JavascriptRunner {
  static TYPES = ["javascript", "javascriptreact", "typescript", "typescriptreact"];

  document: vscode.TextDocument;

  constructor(document: vscode.TextDocument) {
    this.document = document;
  }

  async getJestPath() {
    return JEST_PATH;
  }

  async buildCommand(filter: string) {
    const jestPath = await this.getJestPath();
    return `${jestPath} ${filter}`;
  }

  async run() {
    const fileContents = await vscode.workspace.fs.readFile(this.document.uri);
    const match = fileContents.toString().match(DESCRIBE_BLOCK_REGEX);

    if (!match) {
      return;
    }

    const [, describeFilter] = match;

    TaskManager.runTask(await this.buildCommand(describeFilter), this.document.uri, "Jest");
  }

  static async isTestFile(path: vscode.Uri) {
    const fileContents = await vscode.workspace.fs.readFile(path);
    const match = fileContents.toString().match(DESCRIBE_BLOCK_REGEX);
    return match && match.length > 1;
  }
}
