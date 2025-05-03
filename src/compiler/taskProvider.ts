import * as vscode from 'vscode';
import { Inform7Compiler } from './compiler';

export class Inform7TaskProvider implements vscode.TaskProvider {
    static Inform7Type = 'inform7';

    public async provideTasks(): Promise<vscode.Task[]> {
        const tasks: vscode.Task[] = [];
        
        // Get the workspace folder
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return tasks;
        }

        // Create compile task
        const compileTask = new vscode.Task(
            { type: Inform7TaskProvider.Inform7Type, task: 'compile' },
            workspaceFolders[0],
            'Compile Inform 7 Project',
            'Inform 7',
            new vscode.ShellExecution('inform7', ['-project', '${workspaceFolder}']),
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