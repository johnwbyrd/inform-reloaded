# VSCode Inform 7 Plugin Implementation Plan

## Overview

This document outlines the plan for developing a Visual Studio Code extension that provides support for Inform 7 development. The extension will enable developers to compile and run Inform 7 projects directly within VSCode, with features for problem matching, customizing compilation settings, and code folding based on Inform 7's structural elements.

## Core Features

1. **Inform 7 Language Support**
   - Syntax highlighting for Inform 7 source files
   - Code folding for Volume/Book/Chapter/Section headings
   - Snippets for common Inform 7 patterns

2. **Project Management**
   - Project detection and validation
   - Integration with Inform 7 project structure (.inform folders)

3. **Compilation Integration**
   - Execute the Inform 7 compiler (inform7.exe) from within VSCode
   - Parse and display compilation output
   - Problem matching to link compiler errors to source code
   - Configurable compilation parameters
   - Progress tracking during compilation

4. **Configuration Options**
   - Path to Inform 7 compiler
   - Default compilation flags
   - Project-specific settings

## Implementation Plan

### Phase 1: Extension Setup and Basic Language Support

1. **Create extension project structure**
   - Use `yo code` to generate the extension scaffolding
   - Set up basic package.json with extension metadata

2. **Implement syntax highlighting**
   - Create TextMate grammar for Inform 7 syntax
   - Define patterns for:
     - Headings (Volume/Book/Chapter/Section)
     - Rules and definitions
     - Comments
     - Quoted text

3. **Implement folding provider**
   - Create a folding provider that recognizes Inform 7's structural elements
   - Detect Volume/Book/Chapter/Section headings for folding regions

### Phase 2: Compilation Integration

1. **Define compiler task provider**
   - Create a TaskProvider for Inform 7 compilation
   - Define problem matchers for Inform 7 compiler output
   - Implement progress tracking during compilation

2. **Implement compilation command**
   - Create commands to compile current project
   - Handle different compilation modes (Debug/Release)
   - Parse compiler output for:
     - Progress indicators (e.g., "++ 5% (Analysing sentences)")
     - Error locations (e.g., "In Volume 1 - Game Framework, Book 1 - Basic Setup, Part 1 - Masthead:")
     - Error messages and suggestions
     - Compilation completion status

3. **Configure compiler settings**
   - Add extension settings for compiler path
   - Support for project-specific compiler flags via settings.json
   - UI for modifying compiler settings

4. **Handle compilation output**
   - Parse compiler output
   - Display build progress
   - Show errors and warnings in Problems panel
   - Track compilation status

### Phase 3: Enhanced Features

1. **Implement code intelligence**
   - Go to definition for objects, rules, and phrases
   - Find all references
   - Symbol provider for outline view

2. **Testing support**
   - Integration with Inform 7 testing commands
   - Test runner UI

3. **Documentation integration**
   - Hover information for built-in functions
   - Access to Inform 7 documentation

## Technical Considerations

### Compiler Integration

The extension will need to properly invoke the Inform 7 compiler with appropriate parameters:

```
inform7.exe -project <project-path> [additional-options]
```

Key compiler flags to support from the user interface:
- `-debug` for including debugging features
- `-release` for release builds
- `-format` for output format selection
- `-variable` for pipeline variable settings

### Problem Matching

Create regex patterns to match Inform 7 compiler errors and progress indicators:

```json
{
  "owner": "inform7",
  "pattern": [
    {
      "regexp": "^In Volume (\\d+) - ([^,]+), Book (\\d+) - ([^,]+), Part (\\d+) - ([^:]+):$",
      "file": 1,
      "message": "Error in $2, $4, $6"
    },
    {
      "regexp": "^\\+\\+ (\\d+)% \\(([^)]+)\\)$",
      "message": "Compilation progress: $2 ($1%)"
    },
    {
      "regexp": "^\\+\\+ Ended: Translation (failed|succeeded): (\\d+) problem(s)? found$",
      "message": "Compilation $1: $2 $3"
    }
  ]
}
```

### Launch Configuration

Define a launch.json schema for running Inform 7 stories:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "inform7",
      "request": "launch",
      "name": "Run Inform 7 Story",
      "projectPath": "${workspaceFolder}",
      "storyFile": "${workspaceFolder}/Build/output.ulx"
    }
  ]
}
```

## Project Structure

```
inform-vscode/
├── .vscode/               # VSCode-specific configuration
├── src/                   # Extension source code
│   ├── extension.ts       # Extension activation and setup
│   ├── compiler/          # Compiler integration
│   │   ├── taskProvider.ts
│   │   ├── outputParser.ts
│   │   └── progressTracker.ts
│   ├── folding/           # Folding provider
│   └── utils/             # Helper functions
├── syntaxes/              # TextMate grammar files
│   └── inform7.tmLanguage.json
├── package.json           # Extension manifest
└── README.md              # Extension documentation
```

## Development Milestones

1. **Alpha Release (v0.1.0)**
   - Basic syntax highlighting
   - Folding provider
   - Simple compilation command

2. **Beta Release (v0.5.0)**
   - Full compiler integration
   - Problem matching
   - Progress tracking

3. **Initial Release (v1.0.0)**
   - Complete compilation support
   - Configuration UI
   - Code intelligence features

4. **Feature Release (v1.x)**
   - Enhanced code intelligence
   - Testing support
   - Documentation integration

## Next Steps

1. Set up the extension development environment
2. Research Inform 7 file formats and compiler output patterns
3. Create a prototype for the folding provider
4. Test basic compiler integration 