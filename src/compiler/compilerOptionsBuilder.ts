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
    
    // Add essential path options
    this.addStringOption(options, 'external');
    this.addStringOption(options, 'internal');
    this.addStringOption(options, 'transient');
    
    // Add compilation mode options
    this.addBooleanOption(options, 'debug');
    this.addBooleanOption(options, 'release');
    this.addBooleanOption(options, 'basic');
    
    // Handle output option specially (-o instead of -output)
    const output = this.config.get<string>('compilerFlags.output');
    if (output && output.trim() !== '') {
      options.push('-o', output);
    }
    
    // Handle format option (-format=FORMAT)
    const format = this.config.get<string>('compilerFlags.format');
    if (format && format.trim() !== '') {
      options.push(`-format=${format}`);
    }
    
    // Add additional boolean options
    this.addBooleanOption(options, 'noindex');
    this.addBooleanOption(options, 'noprogress');
    this.addBooleanOption(options, 'silence');
    this.addBooleanOption(options, 'rng');
    
    // Add log options
    const logOptions = this.config.get<string[]>('compilerFlags.logOptions') || [];
    for (const aspect of logOptions) {
      if (aspect && aspect.trim() !== '') {
        options.push(`-log=${aspect}`);
      }
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