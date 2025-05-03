import * as vscode from 'vscode';

export class ProgressTracker {
    private currentProgress: number = 0;
    private resolvePromise: (() => void) | undefined;

    public async start(): Promise<void> {
        this.currentProgress = 0;
        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: "Compiling Inform 7 Project",
                cancellable: false
            },
            async (progress) => {
                return new Promise<void>((resolve) => {
                    this.resolvePromise = resolve;
                    // Store the progress object in a closure
                    const updateProgress = (percentage: number, message: string) => {
                        const increment = percentage - this.currentProgress;
                        this.currentProgress = percentage;
                        progress.report({ increment, message });
                    };
                    // Make updateProgress available to the class
                    (this as any).updateProgress = updateProgress;
                });
            }
        );
    }

    public updateProgress(percentage: number, message: string): void {
        // This will be replaced by the closure in start()
        console.log(`Progress: ${percentage}% - ${message}`);
    }

    public stop(): void {
        if (this.resolvePromise) {
            this.resolvePromise();
        }
    }
} 