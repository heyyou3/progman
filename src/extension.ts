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
		if (isNaN(progressRate)) {
			progManStatusBarItem.hide();
			return;
		}
		progManStatusBarItem.text = getProgMsg(progressRate);
		progManStatusBarItem.show();
	} else {
		progManStatusBarItem.hide();
	}
};

export const paddingStr = (str: string, n: number): string => {
	let strings = '';
	for (let i = 0; i < n; i++) {
		strings += `${str}`;
	}
	return strings;
};

export const displayProgBar = (progressRate: number): string => {
	const progStr = '=';
	const noProgStr = '-';
	if (progressRate <= 0) {
		return `[${paddingStr(noProgStr, 10)}]`;
	} else if (progressRate <= 19) {
		return `[${paddingStr(progStr, 1) + paddingStr(noProgStr, 9)}]`;
	} else if (progressRate <= 29) {
		return `[${paddingStr(progStr, 2) + paddingStr(noProgStr, 8)}]`;
	} else if (progressRate <= 39) {
		return `[${paddingStr(progStr, 3) + paddingStr(noProgStr, 7)}]`;
	} else if (progressRate <= 49) {
		return `[${paddingStr(progStr, 4) + paddingStr(noProgStr, 6)}]`;
	} else if (progressRate <= 59) {
		return `[${paddingStr(progStr, 5) + paddingStr(noProgStr, 5)}]`;
	} else if (progressRate <= 69) {
		return `[${paddingStr(progStr, 6) + paddingStr(noProgStr, 4)}]`;
	} else if (progressRate <= 79) {
		return `[${paddingStr(progStr, 7) + paddingStr(noProgStr, 3)}]`;
	} else if (progressRate <= 89) {
		return `[${paddingStr(progStr, 8) + paddingStr(noProgStr, 2)}]`;
	} else if (progressRate <= 99) {
		return `[${paddingStr(progStr, 9) + paddingStr(noProgStr, 1)}]`;
	} else {
		return `[DONE]`;
	}
};

const getProgMsg = (progressRate: number): string => {
	return `${displayProgBar(progressRate)} ${progressRate}%`;
};

// this method is called when your extension is deactivated
export function deactivate() {}
