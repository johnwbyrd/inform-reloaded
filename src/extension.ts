// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Inform7TaskProvider } from './compiler/taskProvider';
import { Inform7Compiler } from './compiler/compiler';

// Create output channel
let outputChannel: vscode.OutputChannel;
// Status bar item for non-intrusive messages
let statusBarItem: vscode.StatusBarItem;

/**
 * Formats an error for user-friendly display in the output channel
 * @param title The error title
 * @param error The error object or message
 * @param showNotification Whether to show a toast notification
 */
function formatErrorForOutput(title: string, error: unknown, showNotification: boolean = false): void {
	const errorMessage = error instanceof Error ? error.message : String(error);
	
	// Only show toast notification if explicitly requested (for unexpected errors)
	if (showNotification) {
		vscode.window.showErrorMessage(`${title}: ${errorMessage}`);
	}

	// Show a status bar message instead of a toast for configuration errors
	statusBarItem.text = `$(error) ${title}`;
	statusBarItem.tooltip = errorMessage;
	statusBarItem.show();
	
	// Log information to the output channel
	outputChannel.appendLine(`\n❌ ${title}:`);
	outputChannel.appendLine(`   ${errorMessage}`);
	
	// Add some helpful tips based on common errors
	if (errorMessage.includes('compiler not found')) {
		outputChannel.appendLine('\n💡 Tip: Make sure the Inform 7 compiler is installed and the path is correct in settings.');
		outputChannel.appendLine('   Go to Settings > Extensions > Inform 7 Reloaded > Compiler Path');
	} else if (errorMessage.includes('internal resources not found')) {
		outputChannel.appendLine('\n💡 Tip: The internal resources folder contains built-in extensions and templates required by the compiler.');
		outputChannel.appendLine('   Go to Settings > Extensions > Inform 7 Reloaded > Compiler Flags > Internal');
	} else if (errorMessage.includes('Source file not found')) {
		outputChannel.appendLine('\n💡 Tip: Make sure your story file exists in the Source directory.');
		outputChannel.appendLine('   If using a different filename than "story.ni", update the Source File setting.');
	}
	
	// Only log stack traces in debug mode
	if (process.env.VSCODE_DEBUG_MODE === 'true' && error instanceof Error && error.stack) {
		outputChannel.appendLine('\n--- Debug information (for extension developers) ---');
		outputChannel.appendLine(error.stack);
		outputChannel.appendLine('----------------------------------------------');
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	// Create and register output channel
	outputChannel = vscode.window.createOutputChannel('Inform 7 Reloaded');
	
	// Create status bar item
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	statusBarItem.command = 'inform7.showOutput'; // Command to show output when clicked
	context.subscriptions.push(statusBarItem);
	
	// Command to show output channel
	let showOutputCommand = vscode.commands.registerCommand('inform7.showOutput', () => {
		outputChannel.show();
	});
	context.subscriptions.push(showOutputCommand);
	
	// Register the task provider
	const taskProvider = new Inform7TaskProvider();
	context.subscriptions.push(
		vscode.tasks.registerTaskProvider('inform7', taskProvider)
	);

	// Register compile command
	let compileCommand = vscode.commands.registerCommand('inform7.compile', async () => {
		// Reset status bar
		statusBarItem.hide();
		
		const compiler = new Inform7Compiler(outputChannel);
		try {
			await compiler.compile();
			// Show success in status bar
			statusBarItem.text = '$(check) Inform 7 compilation successful';
			statusBarItem.tooltip = 'Compilation completed without errors';
			statusBarItem.show();
			// Auto-hide success message after 5 seconds
			setTimeout(() => statusBarItem.hide(), 5000);
		} catch (error) {
			formatErrorForOutput('Compilation failed', error);
			outputChannel.show(true); // Show and focus the output channel
		}
	});

	// Register run command
	let runCommand = vscode.commands.registerCommand('inform7.run', async () => {
		// Reset status bar
		statusBarItem.hide();
		
		const compiler = new Inform7Compiler(outputChannel);
		try {
			await compiler.run();
			// Show success in status bar briefly
			statusBarItem.text = '$(play) Running Inform 7 story';
			statusBarItem.show();
			// Auto-hide after 3 seconds
			setTimeout(() => statusBarItem.hide(), 3000);
		} catch (error) {
			formatErrorForOutput('Failed to run story', error);
			outputChannel.show(true); // Show and focus the output channel
		}
	});

	context.subscriptions.push(compileCommand, runCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (outputChannel) {
		outputChannel.dispose();
	}
	if (statusBarItem) {
		statusBarItem.dispose();
	}
}
