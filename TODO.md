# Inform 7 Reloaded - Development Roadmap

This document outlines the remaining tasks and planned features for the Inform 7 Reloaded extension.

## Features Status

### Completed
- ✅ Basic extension setup and configuration
- ✅ Basic Inform 7 language support
- ✅ Project compilation integration
- ✅ Error reporting in Problems panel
- ✅ Story execution

### In Progress
- 🚧 Improved syntax highlighting
- 🚧 Cross-platform file path support
- 🚧 Folding provider optimization

### Planned Features

#### Language Support
- Comprehensive syntax highlighting covering all Inform 7 language constructs
- Advanced code folding with proper nesting
- Snippets for common Inform 7 patterns and templates
- Documentation tooltips for standard library functions

#### Compilation Integration
- Support for different compilation modes (debug/release)
- Release packaging options
- Integration with interpreter selection
- Support for multiple output formats
- Improved error message display

#### Project Management
- Inform 7 project creation/initialization
- Resource file management
- Extension/library management

#### Testing & Debugging
- Test command integration
- Skein visualization 
- Transcript recording
- Interactive debugging

#### User Experience
- Custom editor with enhanced visualization
- Inform 7-specific status bar information
- Progress visualization during compilation
- Command palette shortcuts for common Inform 7 tasks

## Implementation Details

### Syntax Highlighting
- Extend language-configuration.json with comprehensive syntax patterns
- Support for rule definitions, relations, kinds, and assertions
- Proper handling of headings, comments, and quoted text

### Compiler Integration
- Graceful handling of different Inform 7 compiler versions
- Handling of multiple story files in a project
- Output format selection (glulx, z-machine)
- Extensible problem matchers for different compiler versions

### Project Management
- Extension-specific UI for creating new Inform 7 projects
- Templates for different game types (parser, choice-based)
- Custom views for managing Inform 7 resources

### Testing Support
- Integration with Inform 7's testing commands
- Custom test runner for in-extension test execution
- Test result visualization

## Technical Architecture

The extension is organized into the following components:

- **extension.ts**: Main entry point and command registration
- **compiler/**: Compilation related functionality
  - compiler.ts: Core compiler integration
  - outputParser.ts: Parsing compiler output
  - progressTracker.ts: Tracking compilation progress
  - taskProvider.ts: VS Code task integration
- **language/**: Language support (to be implemented)
- **project/**: Project management (to be implemented)
- **testing/**: Testing support (to be implemented)

## Next Development Tasks

1. Complete error reporting and problem matching
2. Implement improved syntax highlighting
3. Add support for cross-platform file paths
4. Create basic project templates
5. Implement snippet support for common patterns
6. Add support for documentation lookups 