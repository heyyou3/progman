// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate({ subscriptions }: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "progman" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let progManStatusBarItem: vscode.StatusBarItem;
	progManStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	subscriptions.push(progManStatusBarItem);

	let activeEditor = vscode.window.activeTextEditor;

	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
	}));

	subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			const activeText = event.document.getText();
			const todoCount = activeText.split('- [ ] ').length - 1;
			const doneCount = activeText.split('- [x] ').length - 1;
			const allTodoCount = todoCount + doneCount;
			const progress = Math.floor(doneCount / allTodoCount * 100);
			progManStatusBarItem.text = getProgMsg(progress);
			progManStatusBarItem.show();
		}
	}));
}

const getProgMsg = (progress: number): string => {
	return `進捗率: ${progress}%`;
};

// this method is called when your extension is deactivated
export function deactivate() {}
