import * as vscode from 'vscode';

/**
 * Builds command line options for the Inform 7 compiler based on configuration settings
 */
export class CompilerOptionsBuilder {
  /**
   * Create a new CompilerOptionsBuilder
   * @param config The VS Code workspace configuration
   */
  constructor(private config: vscode.WorkspaceConfiguration) {}
  
  /**
   * Build command line arguments for the Inform 7 compiler
   * @param projectPath Path to the Inform 7 project
   * @returns Array of command line arguments
   */
  buildOptions(projectPath: string): string[] {
    const options: string[] = [];
    
    // Add project path (required)
    options.push('-project', projectPath);
    
    // Add standard options
    this.addStringOption(options, 'external');
    this.addStringOption(options, 'internal');
    this.addStringOption(options, 'transient');
    this.addBooleanOption(options, 'debug');
    this.addBooleanOption(options, 'release');
    this.addBooleanOption(options, 'basic');
    
    // Handle output option specially (-o instead of -output)
    const output = this.config.get<string>('compilerFlags.output');
    if (output && output.trim() !== '') {
      options.push('-o', output);
    }
    
    // Add custom options
    const customFlags = this.config.get<string[]>('customFlags') || [];
    options.push(...customFlags);
    
    return options;
  }
  
  /**
   * Add a string option to the command line arguments if it has a value
   * @param options Array of command line arguments
   * @param name Name of the option
   */
  private addStringOption(options: string[], name: string): void {
    const value = this.config.get<string>(`compilerFlags.${name}`);
    if (value && value.trim() !== '') {
      options.push(`-${name}`, value);
    }
  }
  
  /**
   * Add a boolean option to the command line arguments if it's true
   * @param options Array of command line arguments
   * @param name Name of the option
   */
  private addBooleanOption(options: string[], name: string): void {
    const value = this.config.get<boolean>(`compilerFlags.${name}`);
    if (value === true) {
      options.push(`-${name}`);
    }
  }
} 