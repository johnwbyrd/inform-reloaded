// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Inform7TaskProvider } from './compiler/taskProvider';
import { Inform7Compiler } from './compiler/compiler';

// Create output channel
let outputChannel: vscode.OutputChannel;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	// Create and register output channel
	outputChannel = vscode.window.createOutputChannel('Inform 7 Reloaded');
	outputChannel.show();
	outputChannel.appendLine('Inform 7 Reloaded extension is now active!');
	
	// Register the task provider
	const taskProvider = new Inform7TaskProvider();
	context.subscriptions.push(
		vscode.tasks.registerTaskProvider('inform7', taskProvider)
	);
	outputChannel.appendLine('Task provider registered');

	// Register compile command
	let compileCommand = vscode.commands.registerCommand('inform7.compile', async () => {
		outputChannel.appendLine('Compile command triggered');
		const compiler = new Inform7Compiler(outputChannel);
		try {
			await compiler.compile();
		} catch (error) {
			vscode.window.showErrorMessage(`Compilation failed: ${error}`);
			outputChannel.appendLine(`Compilation failed: ${error}`);
		}
	});

	// Register run command
	let runCommand = vscode.commands.registerCommand('inform7.run', async () => {
		outputChannel.appendLine('Run command triggered');
		const compiler = new Inform7Compiler(outputChannel);
		try {
			await compiler.run();
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to run story: ${error}`);
			outputChannel.appendLine(`Failed to run story: ${error}`);
		}
	});

	context.subscriptions.push(compileCommand, runCommand);
	outputChannel.appendLine('Commands registered');

	// Show a message to confirm activation
	vscode.window.showInformationMessage('Inform 7 Reloaded extension is now active!');
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (outputChannel) {
		outputChannel.appendLine('Inform 7 Reloaded extension is now deactivated');
		outputChannel.dispose();
	}
}
