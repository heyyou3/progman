// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let progManStatusBarItem: vscode.StatusBarItem;
let activeEditor = vscode.window.activeTextEditor;

export function activate({ subscriptions }: vscode.ExtensionContext) {
	progManStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	subscriptions.push(progManStatusBarItem);

	// Update the status bar when switching files
	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateActiveTextEditor));

	// Update the status bar when a file is rewritten
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
		const progressRate = Math.floor(doneCount / allTodoCount * 100);
		progManStatusBarItem.text = getProgMsg(progressRate);
		progManStatusBarItem.show();
	} else {
		progManStatusBarItem.hide();
	}
};

export const paddingHyphen = (n: number): string => {
	let hyphens = '';
	for (let i = 0; i < n; i++) {
		hyphens += '-';
	}
	return hyphens;
};

export const displayProgBar = (progressRate: number): string => {
	if (progressRate <= 0) {
		return `[${paddingHyphen(10)}]`;
	} else if (progressRate <= 19) {
		return `[=${paddingHyphen(9)}]`;
	} else if (progressRate <= 29) {
		return `[==${paddingHyphen(8)}]`;
	} else if (progressRate <= 39) {
		return `[===${paddingHyphen(7)}]`;
	} else if (progressRate <= 49) {
		return `[====${paddingHyphen(6)}]`;
	} else if (progressRate <= 59) {
		return `[=====${paddingHyphen(5)}]`;
	} else if (progressRate <= 69) {
		return `[======${paddingHyphen(4)}]`;
	} else if (progressRate <= 79) {
		return `[=======${paddingHyphen(3)}]`;
	} else if (progressRate <= 89) {
		return `[========${paddingHyphen(2)}]`;
	} else if (progressRate <= 99) {
		return `[=========${paddingHyphen(1)}]`;
	} else {
		return `[DONE]`;
	}
};

const getProgMsg = (progressRate: number): string => {
	return `${displayProgBar(progressRate)} ${progressRate}%`;
};

// this method is called when your extension is deactivated
export function deactivate() {}
