import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { OutputParser } from './outputParser';
import { ProgressTracker } from './progressTracker';
import * as cp from 'child_process';

class Inform7TaskTerminal implements vscode.Pseudoterminal {
    private writeEmitter = new vscode.EventEmitter<string>();
    private closeEmitter = new vscode.EventEmitter<number>();
    onDidWrite: vscode.Event<string> = this.writeEmitter.event;
    onDidClose: vscode.Event<number> = this.closeEmitter.event;

    constructor(
        private projectPath: string,
        private sourceFile: string,
        private compilerPath: string,
        private internalPath: string
    ) {}

    open(): void {
        // First output the source file path
        this.writeEmitter.fire(`SOURCE_FILE_START:${this.sourceFile}:SOURCE_FILE_END\r\n`);

        // Then run the compiler
        const compiler = cp.spawn(this.compilerPath, [
            '-project', this.projectPath,
            '-internal', this.internalPath
        ], {
            cwd: this.projectPath
        });

        compiler.stdout.on('data', (data) => {
            this.writeEmitter.fire(data.toString());
        });

        compiler.stderr.on('data', (data) => {
            this.writeEmitter.fire(data.toString());
        });

        compiler.on('close', (code) => {
            this.closeEmitter.fire(code || 0);
        });
    }

    close(): void {
        // Cleanup if needed
    }
}

export class Inform7Compiler {
    private config: vscode.WorkspaceConfiguration;
    private outputParser: OutputParser;
    private progressTracker: ProgressTracker;

    constructor() {
        this.config = vscode.workspace.getConfiguration('inform7');
        this.outputParser = new OutputParser();
        this.progressTracker = new ProgressTracker();
    }

    public async compile(): Promise<void> {
        const compilerPath = this.config.get<string>('compilerPath');
        const internalPath = this.config.get<string>('internalPath');

        if (!compilerPath) {
            throw new Error('Inform 7 compiler path not configured');
        }

        if (!internalPath) {
            throw new Error('Inform 7 internal resources path not configured');
        }

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            throw new Error('No workspace folder found');
        }

        const projectPath = workspaceFolders[0].uri.fsPath;
        const sourceFile = path.join('Source', this.config.get<string>('inform7.sourceFile') || 'story.ni');

        // Create a task to run the compiler
        const task = new vscode.Task(
            { type: 'inform7', task: 'compile' },
            workspaceFolders[0],
            'Compile Inform 7 Project',
            'Inform 7',
            new vscode.CustomExecution(
                async (): Promise<vscode.Pseudoterminal> => {
                    return new Inform7TaskTerminal(
                        projectPath,
                        sourceFile,
                        compilerPath,
                        internalPath
                    );
                }
            ),
            '$inform7'
        );

        // Configure the task to use our problem matcher and output panel
        task.problemMatchers = ['$inform7'];
        task.presentationOptions = {
            echo: false,
            reveal: vscode.TaskRevealKind.Silent,
            showReuseMessage: false,
            clear: true,
            panel: vscode.TaskPanelKind.Shared,
            focus: false
        };

        // Start progress tracking
        this.progressTracker.start();

        try {
            // Execute the task
            const execution = await vscode.tasks.executeTask(task);
            
            // Wait for the task to complete
            return new Promise<void>((resolve, reject) => {
                const disposable = vscode.tasks.onDidEndTask((e) => {
                    if (e.execution === execution) {
                        disposable.dispose();
                        this.progressTracker.stop();
                        resolve();
                    }
                });
            });
        } catch (error) {
            this.progressTracker.stop();
            throw error;
        }
    }

    public async run(): Promise<void> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            throw new Error('No workspace folder found');
        }

        const projectPath = workspaceFolders[0].uri.fsPath;
        const storyFile = path.join(projectPath, 'Build', 'output.ulx');

        if (!fs.existsSync(storyFile)) {
            throw new Error('Story file not found. Please compile the project first.');
        }

        // Create a task to run the story
        const task = new vscode.Task(
            { type: 'inform7', task: 'run' },
            workspaceFolders[0],
            'Run Inform 7 Story',
            'Inform 7',
            new vscode.ProcessExecution(storyFile),
            '$inform7'
        );

        // Configure the task
        task.presentationOptions = {
            echo: false,
            reveal: vscode.TaskRevealKind.Silent,
            showReuseMessage: false,
            clear: true,
            panel: vscode.TaskPanelKind.Shared,
            focus: false
        };

        // Execute the task
        await vscode.tasks.executeTask(task);
    }
} 