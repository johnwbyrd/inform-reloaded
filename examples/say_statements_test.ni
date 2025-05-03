"Say Statement Test" by "Author"

The Introduction is a room. "This is the introduction to our game."

When play begins:
	say "Welcome, adventurer. You are about to embark on a journey, just as exciting as The Beastmaster or Krull, but one that you experience on your personal microcomputer. In this incredible new medium, we use your personal microcomputer as a window into a dynamic new form of storytelling. Unlike a traditional book, where you turn pages and may get paper cuts, your choices drive the story forward, by typing on your microcomputer, and seeing the results pop up as words on your color TV. We like to call this incredible new medium, 'interactive fiction,' in that it is both fictional, which means made up, and it is interactive, which means active in an inter way.[paragraph break]";

	say "This is a [bold type]complex[roman type] say statement with [italic type]multiple[roman type] formatting instructions. There are [if true]conditional[otherwise]alternative[end if] elements as well.";

Instead of examining the player:
	say "You see yourself standing in [location], feeling [one of]confident[or]uncertain[or]excited[at random].";
	
Instead of jumping:
	if a random chance of 1 in 2 succeeds:
		say "You jump around like a kangaroo.";
	otherwise:
		say "You attempt to jump, but instead just awkwardly hop a bit.";
		
Every turn:
	say "The time is now [time of day] on day [turn count].";

Table of Responses
Response	Probability
"You feel a slight breeze."	20
"Nothing happens."	50
"You hear a distant sound."	30

To say random atmospheric event:
	let R be a random number from 1 to 100;
	if R <= 20:
		say "You feel a slight breeze.";
	otherwise if R <= 70:
		say "Nothing happens.";
	otherwise:
		say "You hear a distant sound." 