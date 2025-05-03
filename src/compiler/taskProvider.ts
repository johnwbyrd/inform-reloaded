import * as vscode from 'vscode';
import { Inform7Compiler } from './compiler';
import { CompilerOptionsBuilder } from './compilerOptionsBuilder';

export class Inform7TaskProvider implements vscode.TaskProvider {
    static Inform7Type = 'inform7';

    public async provideTasks(): Promise<vscode.Task[]> {
        const tasks: vscode.Task[] = [];
        
        // Get the workspace folder
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return tasks;
        }

        // Get Inform 7 configuration
        const config = vscode.workspace.getConfiguration('inform7');
        const compilerPath = config.get<string>('compilerPath');
        
        if (!compilerPath) {
            return tasks;
        }

        const projectPath = workspaceFolders[0].uri.fsPath;
        
        // Build the compiler options
        const optionsBuilder = new CompilerOptionsBuilder(config);
        const compilerArgs = optionsBuilder.buildOptions(projectPath);

        // Create compile task
        const compileTask = new vscode.Task(
            { type: Inform7TaskProvider.Inform7Type, task: 'compile' },
            workspaceFolders[0],
            'Compile Inform 7 Project',
            'Inform 7',
            new vscode.ShellExecution(compilerPath, compilerArgs),
            '$inform7'
        );
        compileTask.group = vscode.TaskGroup.Build;
        tasks.push(compileTask);

        return tasks;
    }

    public resolveTask(task: vscode.Task): vscode.Task | undefined {
        return task;
    }
} 