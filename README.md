# Inform 7 Reloaded

A modern development environment for Inform 7 interactive fiction in Visual Studio Code.

This extension provides comprehensive support for developing Inform 7 stories directly within VS Code, including compilation, error reporting, and story execution.

## Features

- **Syntax Highlighting**: Support for Inform 7's natural language syntax
- **Code Folding**: Automatic folding for Volumes, Books, Chapters, and Sections
- **Project Compilation**: Compile Inform 7 projects with a single command
- **Advanced Error Reporting**: Errors display in VS Code's Problems panel with line highlighting and improved multi-line error handling
- **Story Execution**: Run your compiled stories directly from VS Code
- **Comprehensive Compiler Configuration**: Customize all available compiler flags through VS Code settings
- **Clean Output**: Streamlined compiler output without verbose prefixes or unnecessary diagnostic messages

## Installation

1. Install this extension from the VS Code Marketplace
2. Install the [Inform 7](https://inform7.com/) compiler on your system

## Setup

Before using the extension, you need to configure the following required settings:

1. Open VS Code Settings (File > Preferences > Settings)
2. Search for "Inform7"
3. Set `inform7.compilerPath` to the full path of your Inform 7 compiler executable
4. Set `inform7.compilerFlags.internal` to the path of your Inform 7 internal resources folder
5. Optionally configure `inform7.sourceFile` if your main source file is not "story.ni"

Example configuration:

```json
{
  "inform7.compilerPath": "C:\\Program Files\\Inform 7\\Compilers\\inform7.exe",
  "inform7.compilerFlags.internal": "C:\\Program Files\\Inform 7\\Internal",
  "inform7.sourceFile": "story.ni"
}
```

## Compiler Configuration Options

The extension supports a comprehensive range of Inform 7 compiler options, all configurable through VS Code settings.

### Basic Configuration

- **`inform7.compilerPath`**: Path to the Inform 7 command line compiler executable (ni).
  - This should be the full path to the `ni` executable.
  - Example: `C:/Program Files/Inform/Compilers/ni`

- **`inform7.sourceFile`**: Name of the main source file (relative to the Source directory).
  - Default: `story.ni`
  - Only change this if your main source file has a different name.

### Essential Paths

- **`inform7.compilerFlags.internal`** (Required): Path to the Inform 7 internal resources.
  - This directory contains all the standard rules, extensions, and templates required by the compiler.
  - Example: `C:/Program Files/Inform/Internal`

- **`inform7.compilerFlags.external`**: Path to external resources.
  - This directory contains your user-installed extensions, census data, and other resources outside the core system.
  - Example: `C:/Users/YourName/Documents/Inform`
  - Default location on Windows: `%USERPROFILE%\Documents\Inform`

- **`inform7.compilerFlags.transient`**: Path to a temporary working directory.
  - Optional directory where temporary files can be stored during compilation.
  - Only needed in specific cases where the default temporary directory is not suitable.

### Output Options

- **`inform7.compilerFlags.output`**: Output file specification (`-o` flag).
  - Specifies the name/path for the output file.
  - If not specified, the default output filenames will be used based on the format.

- **`inform7.compilerFlags.format`**: Output file format (`-format=FORMAT` flag).
  - Available options: `ulx`, `Inform6/16d`, `Inform6/32d`
  - `ulx` is Glulx format (default, supports larger games)
  - `Inform6/16d` is Z-code compatible format for smaller games
  - `Inform6/32d` is for medium-sized games with Z-machine compatibility

### Compilation Modes

- **`inform7.compilerFlags.debug`**: Include debugging features (`-debug` flag).
  - When enabled, adds debugging commands to the compiled story file.
  - Adds commands like `ACTIONS`, `RULES`, `PURLOIN`, `GONEAR`, `SCOPE`, etc.
  - Recommended during development and testing phases.

- **`inform7.compilerFlags.release`**: Build a release version (`-release` flag).
  - When enabled, produces a story file intended for release to players.
  - Removes debugging commands and test features.
  - Recommended when preparing your final story for distribution.
  - Can be combined with `debug` for late-stage testing.

- **`inform7.compilerFlags.basic`**: Use Basic Inform mode (`-basic` flag).
  - Compiles a "basic" project with no command parser or world model.
  - Converts Inform into a general-purpose programming language without interactive fiction infrastructure.
  - Rarely needed for standard interactive fiction projects.

### Performance Options

- **`inform7.compilerFlags.noindex`**: Skip Index generation (`-noindex` flag).
  - Reduces compilation time and disk space usage by not generating the Index.
  - The Index is typically used by the IDE for navigation and documentation, but isn't needed for command-line compilation.
  - For large projects, this can significantly improve performance.

- **`inform7.compilerFlags.noprogress`**: Suppress progress reports (`-noprogress` flag).
  - Reduces console output during compilation by not showing the detailed progress of each compilation phase.
  - Makes the Output panel less cluttered with `++ XX% (Phase name)` messages.

- **`inform7.compilerFlags.silence`**: Minimize console output (`-silence` flag).
  - Keeps compiler almost completely quiet during compilation, showing only essential error messages.
  - Also formats error messages in a Unix-style 'filename:line:' format convenient for IDE parsing.
  - Combines well with `-noindex` and `-noprogress`.

### Testing Options

- **`inform7.compilerFlags.rng`**: Make random outcomes predictable (`-rng` flag).
  - Useful for testing features that involve randomness.
  - When enabled, the random number generator will produce the same sequence of values on each run.
  - Makes randomized events reproducible for testing.

### Debug Logging

- **`inform7.compilerFlags.logOptions`**: Enable specific debugging logs (`-log=ASPECT` flag).
  - Available options:
    - `predicate-calculus`: Details about the predicate calculus used in parsing and reasoning
    - `inter`: Information about the intermediate representation created during compilation
    - `grammar`: Shows how grammar rules are applied during parsing
    - `excerpt-meanings`: Details about how text excerpts are interpreted
    - `phrase-compilation`: Information about the compilation of phrases
    - `phrase-usage`: Shows how phrases are used
    - `property-creations`: Details about property creation
    - `rule-attachments`: Information about how rules are attached to triggers
    - `vocabulary`: Details about the vocabulary defined in the story
    - `kind-checking`: Information about type checking
  - Multiple aspects can be enabled simultaneously for comprehensive debugging.

### Custom Flags

- **`inform7.customFlags`**: Array of additional command line flags.
  - For advanced users who need specific compiler options not covered by the settings above.
  - Examples include:
    - `["-variable", "TEST_MODE=true"]`: Set a compile-time variable
    - `["-census"]`: Update the extension census
    - `["-scoring"]`: Enable scoring

## Common Configuration Scenarios

### Development Configuration

```json
{
  "inform7.compilerFlags.debug": true,
  "inform7.compilerFlags.release": false,
  "inform7.compilerFlags.noindex": false
}
```

### Performance-Focused Configuration

```json
{
  "inform7.compilerFlags.noindex": true,
  "inform7.compilerFlags.noprogress": true,
  "inform7.compilerFlags.silence": true
}
```

### Release Configuration

```json
{
  "inform7.compilerFlags.debug": false,
  "inform7.compilerFlags.release": true,
  "inform7.compilerFlags.noindex": true
}
```

### Testing Configuration

```json
{
  "inform7.compilerFlags.debug": true,
  "inform7.compilerFlags.rng": true,
  "inform7.compilerFlags.noindex": true
}
```

## Error Reporting

The extension provides enhanced error reporting capabilities:

- Inform 7's multi-line error messages are processed and displayed in VS Code's Problems panel
- Error positions are highlighted directly in your source code
- Clicking on an error in the Problems panel takes you to the exact location of the issue
- Complex error messages are preprocessed to extract line numbers and relevant details

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

### Output Channels

The extension uses VS Code's output channels efficiently:

- **Extension Output**: Contains minimal diagnostic information from the extension itself
- **Terminal Output**: Shows the actual compiler output with clean formatting

## Requirements

- Visual Studio Code 1.74.0 or higher
- Inform 7 compiler (v10.1.0 or higher recommended)
- A properly structured Inform 7 project

## Known Issues and Limitations

- Code intelligence features (go to definition, etc.) are not yet implemented
- Cross-platform path handling is still being improved

## Roadmap

Future versions will include:

- Enhanced syntax highlighting and snippets
- Code intelligence (go to definition, symbol search)
- Testing support
- Documentation integration
- Multi-format story output
- Extension pack including interpreters for running stories

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
