// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let progManStatusBarItem: vscode.StatusBarItem;
let activeEditor = vscode.window.activeTextEditor;

export function activate({ subscriptions }: vscode.ExtensionContext) {
	progManStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	subscriptions.push(progManStatusBarItem);

	// ファイルを切り替えた際にステータスバーをアップデートする
	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateActiveTextEditor));

	// ファイルが書き換わった際にステータスバーをアップデートする
	subscriptions.push(vscode.workspace.onDidChangeTextDocument(updateChangeTextDocument));
}

const updateActiveTextEditor = (editor: vscode.TextEditor | undefined): void => {
	activeEditor = editor;

	if (activeEditor && activeEditor.document.languageId === 'markdown') {
		progManStatusBarItem.show();
	} else {
		progManStatusBarItem.hide();
	}
};

const updateChangeTextDocument = (event: vscode.TextDocumentChangeEvent): void => {
	if (activeEditor && event.document === activeEditor.document && activeEditor.document.languageId === 'markdown') {
		const activeText = event.document.getText();
		const todoCount = activeText.split('- [ ] ').length - 1;
		const doneCount = activeText.split('- [x] ').length - 1;
		const allTodoCount = todoCount + doneCount;
		const progress = Math.floor(doneCount / allTodoCount * 100);
		progManStatusBarItem.text = getProgMsg(progress);
		progManStatusBarItem.show();
	} else {
		progManStatusBarItem.hide();
	}
};

const getProgMsg = (progress: number): string => {
	return `進捗率: ${progress}%`;
};

// this method is called when your extension is deactivated
export function deactivate() {}
