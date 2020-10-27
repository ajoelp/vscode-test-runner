import * as vscode from "vscode";
import * as path from "path";
import TaskManager from "../services/TaskManager";

const PHP_TEST_REGEX = /@test/;

const PHPUNIT_PATH = "./vendor/bin/phpunit";

export default class PHPRunner {
  static TYPES = ["php"];

  document: vscode.TextDocument;

  constructor(document: vscode.TextDocument) {
    this.document = document;
  }

  async getPhpunitPath() {
    return PHPUNIT_PATH;
  }

  async buildCommand(filter: string) {
    const phpunitPath = await this.getPhpunitPath();
    return `${phpunitPath} --filter ${filter}`;
  }

  async run() {
    const [fileName] = path.basename(this.document.uri.toString()).split(".");

    TaskManager.runTask(await this.buildCommand(fileName), this.document.uri, "PhpUnit");
  }

  static async isTestFile(path: vscode.Uri) {
    const fileContents = await vscode.workspace.fs.readFile(path);
    const match = fileContents.toString().match(PHP_TEST_REGEX);
    return match && match.length > 0;
  }
}
