import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { OutputParser } from './outputParser';
import { ProgressTracker } from './progressTracker';
import { CompilerOptionsBuilder } from './compilerOptionsBuilder';
import * as cp from 'child_process';

class Inform7TaskTerminal implements vscode.Pseudoterminal {
    private writeEmitter = new vscode.EventEmitter<string>();
    private closeEmitter = new vscode.EventEmitter<number>();
    onDidWrite: vscode.Event<string> = this.writeEmitter.event;
    onDidClose: vscode.Event<number> = this.closeEmitter.event;
    private errorBuffer: string[] = [];
    private isInErrorBlock = false;
    private sourceFilePath: string;

    constructor(
        private projectPath: string,
        private sourceFile: string,
        private compilerPath: string,
        private compilerArgs: string[],
        private outputChannel: vscode.OutputChannel
    ) {
        this.sourceFilePath = sourceFile;
    }

    open(): void {
        // First output the source file path
        const filePath = `SOURCE_FILE_START:${this.sourceFile}:SOURCE_FILE_END\r\n`;
        // Don't log this detail to the output channel
        this.writeEmitter.fire(filePath);

        // Then run the compiler with the provided args
        // Log the command being run, which is useful information
        this.outputChannel.appendLine(`Running Inform 7 compiler with: ${this.compilerPath} ${this.compilerArgs.join(' ')}`);
        const compiler = cp.spawn(this.compilerPath, this.compilerArgs, {
            cwd: this.projectPath
        });

        compiler.stdout.on('data', (data) => {
            const output = data.toString();
            this.outputChannel.appendLine(output);
            this.writeEmitter.fire(output);
        });

        compiler.stderr.on('data', (data) => {
            const output = data.toString();
            this.outputChannel.appendLine(output);
            
            // Process output for error detection
            this.processErrorOutput(output);
            
            // Still emit the original output
            this.writeEmitter.fire(output);
        });

        compiler.on('close', (code) => {
            // Process any remaining errors in the buffer
            this.processRemainingErrors();
            
            this.outputChannel.appendLine(`Compiler process closed with code: ${code}`);
            this.closeEmitter.fire(code || 0);
        });
    }

    private processErrorOutput(output: string): void {
        // Split the output by lines and process each line
        const lines = output.split(/\r?\n/);
        
        for (const line of lines) {
            // Start collecting error information when we see an error header
            if (line.trim().startsWith('In ') && line.trim().endsWith(':')) {
                this.isInErrorBlock = true;
                this.errorBuffer = [line];
            } 
            // Collect error details
            else if (this.isInErrorBlock) {
                this.errorBuffer.push(line);
                
                // When we reach the end of an error block, process it
                if (line.trim() === '' || line.includes('++ Ended:')) {
                    this.processErrorBlock();
                    this.isInErrorBlock = false;
                    this.errorBuffer = [];
                }
            }
        }
    }
    
    private processErrorBlock(): void {
        // Look for the line containing the error message and line number
        const errorLines = this.errorBuffer.join('\n');
        
        // Extract line number from the pattern: (source text, line XX)
        const lineMatch = errorLines.match(/\(source text, line (\d+)\)/);
        if (!lineMatch) return;
        
        const lineNumber = lineMatch[1];
        
        // Try to extract a meaningful error message
        let errorMessage = '';
        
        // Look for the line starting with >-->
        for (const line of this.errorBuffer) {
            if (line.includes('>-->')) {
                // Extract everything after >-->
                const messageParts = line.split('>-->');
                if (messageParts.length > 1) {
                    errorMessage = messageParts[1].trim();
                    
                    // If the message continues on next lines (indented), add them
                    const errorIndex = this.errorBuffer.indexOf(line);
                    for (let i = errorIndex + 1; i < this.errorBuffer.length; i++) {
                        const nextLine = this.errorBuffer[i].trim();
                        if (nextLine === '' || nextLine.startsWith('++')) break;
                        errorMessage += ' ' + nextLine;
                    }
                    
                    break;
                }
            }
        }
        
        // If we couldn't extract a message, use the whole error block
        if (!errorMessage) {
            errorMessage = this.errorBuffer.join(' ').replace(/\s+/g, ' ').trim();
        }
        
        // Output the error in our custom format
        const customError = `INFORM7_ERROR|${this.sourceFilePath}|${lineNumber}|${errorMessage}\r\n`;
        this.writeEmitter.fire(customError);
    }
    
    private processRemainingErrors(): void {
        if (this.isInErrorBlock && this.errorBuffer.length > 0) {
            this.processErrorBlock();
            this.isInErrorBlock = false;
            this.errorBuffer = [];
        }
    }

    close(): void {
        // Cleanup if needed
    }
}

export class Inform7Compiler {
    private config: vscode.WorkspaceConfiguration;
    private outputParser: OutputParser;
    private progressTracker: ProgressTracker;
    private outputChannel: vscode.OutputChannel;

    constructor(outputChannel: vscode.OutputChannel) {
        this.config = vscode.workspace.getConfiguration('inform7');
        this.outputParser = new OutputParser();
        this.progressTracker = new ProgressTracker();
        this.outputChannel = outputChannel;
    }

    /**
     * Validates that a path exists
     * @param pathToCheck The path to check
     * @param errorMessage The error message to throw if the path doesn't exist
     * @private
     */
    private validatePathExists(pathToCheck: string, errorMessage: string): void {
        if (!fs.existsSync(pathToCheck)) {
            throw new Error(errorMessage);
        }
    }

    public async compile(): Promise<void> {
        // Get workspace folder
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            throw new Error('No workspace folder found');
        }
        const projectPath = workspaceFolders[0].uri.fsPath;

        // Check compiler path
        const compilerPath = this.config.get<string>('compilerPath');
        if (!compilerPath) {
            throw new Error('Inform 7 compiler path not configured. Please set inform7.compilerPath in settings.');
        }
        this.validatePathExists(
            compilerPath, 
            `Inform 7 compiler not found at path: ${compilerPath}. Please check the inform7.compilerPath setting.`
        );

        // Check internal resources path
        const internalPath = this.config.get<string>('compilerFlags.internal');
        if (!internalPath) {
            throw new Error('Inform 7 internal resources path not configured. Please set inform7.compilerFlags.internal in settings.');
        }
        this.validatePathExists(
            internalPath,
            `Inform 7 internal resources not found at path: ${internalPath}. Please check the inform7.compilerFlags.internal setting.`
        );

        // Check external resources path (if specified)
        const externalPath = this.config.get<string>('compilerFlags.external');
        if (externalPath && externalPath.trim() !== '') {
            this.validatePathExists(
                externalPath,
                `Inform 7 external resources not found at path: ${externalPath}. Please check the inform7.compilerFlags.external setting.`
            );
        }

        // Check source file
        const sourceFileName = this.config.get<string>('sourceFile') || 'story.ni';
        const sourceFile = path.join('Source', sourceFileName);
        const fullSourcePath = path.join(projectPath, sourceFile);
        
        this.validatePathExists(
            fullSourcePath,
            `Source file not found: ${sourceFile}. Please check the inform7.sourceFile setting or create the file at the expected location.`
        );
        
        // Build the compiler options
        const optionsBuilder = new CompilerOptionsBuilder(this.config);
        const compilerArgs = optionsBuilder.buildOptions(projectPath);

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
                        compilerArgs,
                        this.outputChannel
                    );
                }
            ),
            '$inform7'
        );

        // Configure the task to use our problem matcher and output panel
        task.problemMatchers = ['$inform7'];
        this.outputChannel.appendLine(`Compiling Inform 7 project...`);
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
        
        // Determine output format
        const format = this.config.get<string>('compilerFlags.format') || 'ulx';
        
        // Determine output path from settings or use default
        const outputConfig = this.config.get<string>('compilerFlags.output') || '';
        let storyFile: string;
        
        if (outputConfig && outputConfig.trim() !== '') {
            // If output is explicitly specified, use that
            storyFile = path.isAbsolute(outputConfig) 
                ? outputConfig 
                : path.join(projectPath, outputConfig);
        } else {
            // Use default path based on format
            storyFile = path.join(projectPath, 'Build', `output.${format}`);
        }

        // Check if the story file exists
        this.validatePathExists(
            storyFile,
            `Compiled story file not found: ${storyFile}. Please compile the project first.`
        );

        // Open the story file with the default application
        try {
            // Use code's built-in file opener
            vscode.env.openExternal(vscode.Uri.file(storyFile));
            
            this.outputChannel.appendLine(`Opened story file: ${storyFile}`);
        } catch (error) {
            throw new Error(`Failed to open story file: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
} 