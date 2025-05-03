"Syntax Test" by "Author"

Volume 1 - World Model

Book 1 - Rooms

Chapter 1 - The House

Section 1 - Living Area

The Living Room is a room. "This is a cozy living room with [if the time of day is evening]soft evening light[otherwise]bright sunlight[end if] streaming through the windows. A comfortable [bold type]sofa[roman type] sits against the wall."

The sofa is a supporter in the Living Room. The description is "A large, comfortable sofa upholstered in [italic type]deep blue velvet[roman type]."

[This is a comment that describes something important]

Instead of jumping:
	say "You jump on the spot, but it accomplishes little.";
	if the player is in the Living Room:
		say "The wooden floor creaks under your feet."

Book 2 - Tables and Data

Table of Furniture
Item	Type	Description	Count
"sofa"	"supporter"	"A comfortable piece of furniture"	1
"table"	"supporter"	"A wooden surface"	2
"chair"	"supporter"	"Something to sit on"	4
"lamp"	"device"	"Provides light when switched on"	3

Table of Room Connections with 5 rows
Origin	Destination	Direction
Living Room	Kitchen	east
Kitchen	Dining Room	south
Dining Room	Living Room	west
Living Room	Hallway	north
Hallway	Bathroom	east

Chapter 2 - Actions and Rules

Understand "rest on [something]" or "lie on [something]" or "lie down on [something]" as resting on.

Resting on is an action applying to one thing.

Check resting on:
	if the noun is not a supporter:
		say "[The noun] [are] not something you can rest on." instead.

Carry out resting on:
	say "You make yourself comfortable on [the noun].";
	if the noun is the sofa:
		say "It's extremely soft and you feel your eyelids growing heavy." 