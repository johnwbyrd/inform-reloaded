# Inform 7 Reloaded - Development Roadmap

This document outlines the remaining tasks and planned features for the Inform 7 Reloaded extension.

## Features Status

### Completed
- ✅ Basic extension setup and configuration
- ✅ Basic Inform 7 language support
- ✅ Project compilation integration
- ✅ Error reporting in Problems panel
- ✅ Story execution
- ✅ Comprehensive compiler flag configuration
- ✅ Enhanced error handling for multi-line errors
- ✅ Clean output handling with reduced diagnostic noise
- ✅ Custom problem matcher for Inform 7 errors
- ✅ Comprehensive syntax highlighting for Inform 7

### In Progress
- 🚧 Cross-platform file path support
- 🚧 Folding provider optimization

### Planned Features

#### Language Support
- Advanced code folding with proper nesting
- Snippets for common Inform 7 patterns and templates
- Documentation tooltips for standard library functions

#### Compilation Integration
- ✅ Support for different compilation modes (debug/release)
- ✅ Configuration options for all compiler flags
- Release packaging options
- Integration with interpreter selection
- Support for multiple output formats
- ✅ Improved error message display

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
- ✅ Graceful handling of different compiler options
- ✅ Comprehensive compiler flag configuration
- Handling of multiple story files in a project
- ✅ Output format selection (glulx, z-machine)
- ✅ Extensible problem matchers for different compiler versions

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
  - compilerOptionsBuilder.ts: Building compiler command line options
  - errorPreprocessor.ts: Handling multi-line errors
  - outputParser.ts: Parsing compiler output
  - progressTracker.ts: Tracking compilation progress
  - taskProvider.ts: VS Code task integration
- **language/**: Language support (to be implemented)
- **project/**: Project management (to be implemented)
- **testing/**: Testing support (to be implemented)

## Next Development Tasks

1. ✅ Complete error reporting and problem matching
2. ✅ Implement comprehensive compiler flag support
3. Implement improved syntax highlighting
4. Add support for cross-platform file paths
5. Create basic project templates
6. Implement snippet support for common patterns
7. Add support for documentation lookups
8. Improve UX for compiler output and error handling

## Recent Improvements

- Added detailed documentation for all compiler options in package.json
- Implemented error preprocessing to handle multi-line Inform 7 errors
- Added support for all standard compiler flags including format, noindex, noprogress, and silence
- Improved output handling for cleaner compilation feedback
- Reorganized settings in package.json for better user experience
- Enhanced README with comprehensive compiler configuration details 