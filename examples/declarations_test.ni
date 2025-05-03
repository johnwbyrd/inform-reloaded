"Declarations Test" by "Author"

Chapter 1 - Variable Declarations

The current response table is a table-name that varies.
The maximum score is a number that varies.
The player's command is a text that varies.

Chapter 2 - Kind Definitions

Outcome is a kind of value. The outcomes are authorized, refused, and unmanaged.
Response type is a kind of value. The response types are error, warning, debug, and info.
Color is a kind of value. The colors are red, green, blue, yellow, purple, and white.

Chapter 3 - Complex Declarations

A person has a number called hit points. A person has a response type.
A room has an outcome. A room can be lit or unlit.
The Kitchen is a room. The Kitchen is lit. The outcome of the Kitchen is authorized.

Chapter 4 - Tables with Variables

Table of Responses
Response	Type	Description
"Access denied"	error	"User lacks permission"
"Resource unavailable"	warning	"The requested resource is not ready"
"Operation complete"	info	"The operation completed successfully"

When play begins:
	now the current response table is the Table of Responses;
	say "The current response table is [current response table].";
	say "The first response is [response in row 1 of the Table of Responses]."; 