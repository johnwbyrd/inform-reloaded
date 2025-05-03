import * as vscode from 'vscode';

export class OutputParser {
    private diagnosticCollection: vscode.DiagnosticCollection;

    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('inform7');
    }

    public parseOutput(output: string): void {
        // Clear previous diagnostics
        this.diagnosticCollection.clear();

        // Split output into lines
        const lines = output.split('\n');
        
        // Process each line
        for (const line of lines) {
            // Match error locations
            const errorMatch = line.match(/^In Volume (\d+) - ([^,]+), Book (\d+) - ([^,]+), Part (\d+) - ([^:]+):$/);
            if (errorMatch) {
                // TODO: Map the error location to a file and line number
                // This will require parsing the project structure
                continue;
            }

            // Match progress indicators
            const progressMatch = line.match(/^\+\+ (\d+)% \(([^)]+)\)$/);
            if (progressMatch) {
                const percentage = parseInt(progressMatch[1]);
                const stage = progressMatch[2];
                // TODO: Update progress in the UI
                continue;
            }

            // Match completion status
            const completionMatch = line.match(/^\+\+ Ended: Translation (failed|succeeded): (\d+) problem(s)? found$/);
            if (completionMatch) {
                const status = completionMatch[1];
                const problemCount = parseInt(completionMatch[2]);
                // TODO: Update completion status in the UI
                continue;
            }
        }
    }

    public dispose(): void {
        this.diagnosticCollection.dispose();
    }
} 