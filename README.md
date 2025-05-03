# Inform 7 Reloaded

A modern development environment for Inform 7 interactive fiction in Visual Studio Code.

This extension provides comprehensive support for developing Inform 7 stories directly within VS Code, including compilation, error reporting, and story execution.

## Features

- **Syntax Highlighting**: Support for Inform 7's natural language syntax
- **Code Folding**: Automatic folding for Volumes, Books, Chapters, and Sections
- **Project Compilation**: Compile Inform 7 projects with a single command
- **Error Reporting**: Errors display in VS Code's Problems panel with line highlighting
- **Story Execution**: Run your compiled stories directly from VS Code

## Installation

1. Install this extension from the VS Code Marketplace
2. Install the [Inform 7](https://inform7.com/) compiler on your system

## Setup

Before using the extension, you need to configure the following settings:

1. Open VS Code Settings (File > Preferences > Settings)
2. Search for "Inform7"
3. Configure the following required settings:
   - `inform7.compilerPath`: Full path to the Inform 7 compiler executable
   - `inform7.internalPath`: Path to Inform 7's internal resources folder
   - `inform7.sourceFile`: (Optional) Name of your main source file (defaults to "story.ni")

Example configuration:

```json
{
  "inform7.compilerPath": "C:\\Program Files\\Inform 7\\Compilers\\inform7.exe",
  "inform7.internalPath": "C:\\Program Files\\Inform 7\\Internal",
  "inform7.sourceFile": "Source\\story.ni"
}
```

## Usage

### Opening a Project

Open your Inform 7 project folder in VS Code. The extension expects a standard Inform 7 project structure with a `Source` directory containing your `.ni` files.

### Compiling Your Story

There are several ways to compile your project:

- Press `Ctrl+Shift+B` (or `Cmd+Shift+B` on macOS) and select "Compile Inform 7 Project"
- Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run "Compile Inform 7 Project"
- Right-click in an Inform 7 file and select "Compile Inform 7 Project" from the context menu

### Running Your Story

After successful compilation:

- Open the Command Palette and run "Run Inform 7 Story"
- The story will open in a separate window

### Fixing Errors

When compilation fails:

1. Errors will appear in the Problems panel (`Ctrl+Shift+M` or `Cmd+Shift+M`)
2. Click on an error to navigate to the relevant line in your source code
3. Fix the issue and recompile

## Requirements

- Visual Studio Code 1.74.0 or higher
- Inform 7 compiler (v10.1.0 or higher recommended)
- A properly structured Inform 7 project

## Known Issues and Limitations

- Currently supports basic compilation and error reporting
- Code intelligence features (go to definition, etc.) are not yet implemented
- Only supports Windows paths (cross-platform support coming soon)

## Roadmap

Future versions will include:

- Enhanced syntax highlighting and snippets
- Code intelligence (go to definition, symbol search)
- Testing support
- Documentation integration
- Multi-format story output

## Contributing

Contributions are welcome! If you'd like to help improve this extension:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

This extension is licensed under the MIT License.

## Acknowledgements

- Graham Nelson and the Inform 7 team for creating an amazing interactive fiction language
- The VS Code team for their excellent extension platform
