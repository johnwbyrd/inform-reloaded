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
	outputChannel.appendLine('Inform 7 Reloaded extension is now active!');
	
	// Register the task provider
	const taskProvider = new Inform7TaskProvider();
	context.subscriptions.push(
		vscode.tasks.registerTaskProvider('inform7', taskProvider)
	);

	// Register compile command
	let compileCommand = vscode.commands.registerCommand('inform7.compile', async () => {
		const compiler = new Inform7Compiler(outputChannel);
		try {
			await compiler.compile();
		} catch (error) {
			// Extract and display the error message
			const errorMessage = error instanceof Error ? error.message : String(error);
			
			// Show a concise error message in the UI
			vscode.window.showErrorMessage(`Compilation failed: ${errorMessage}`);
			
			// Log more detailed information to the output channel
			outputChannel.show(true); // Show and focus the output channel
			outputChannel.appendLine(`\nCompilation failed: ${errorMessage}`);
			
			if (error instanceof Error && error.stack) {
				outputChannel.appendLine(`\nStack trace:\n${error.stack}`);
			}
		}
	});

	// Register run command
	let runCommand = vscode.commands.registerCommand('inform7.run', async () => {
		const compiler = new Inform7Compiler(outputChannel);
		try {
			await compiler.run();
		} catch (error) {
			// Extract and display the error message
			const errorMessage = error instanceof Error ? error.message : String(error);
			
			// Show a concise error message in the UI
			vscode.window.showErrorMessage(`Failed to run story: ${errorMessage}`);
			
			// Log more detailed information to the output channel
			outputChannel.show(true); // Show and focus the output channel
			outputChannel.appendLine(`\nFailed to run story: ${errorMessage}`);
			
			if (error instanceof Error && error.stack) {
				outputChannel.appendLine(`\nStack trace:\n${error.stack}`);
			}
		}
	});

	context.subscriptions.push(compileCommand, runCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (outputChannel) {
		outputChannel.dispose();
	}
}
