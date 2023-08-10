# SNAKE - JS
#### Video Demo:  <URL HERE>
#### Description:
The final project consists of the game Snake programmed mainly in JavaScript.
I choose JavaScript as an programming language since it can be run from any Browser which makes the game more accesible. 
The Backend is run through the FLASK Python Framework, mainly due to the fact that it was covered in the Course itself. This is combined with the fact that I feel most confortable using Python.
SQLITE3 is used for handeling the database, against due to the reason it was covered in the course aswell.

The Main Script is app.py which is used to run the server with the flask framework. This also fixes the Project setup structure based on the FLASK template.
Besides Hosting the webpage, app.py handels the LogIn-Method which is used for storing the scores of the user. LogIn creates a session to hold the information of the current user and the change method enables a user to change his name. Lastly app.py is responsible for storing the scores in the database scores.db.

in Templates are the files index.html & layout.html. Index.html is the main page displaying the game run thorugh JavaScript and also the Leaderboard which is based on the top 10 Scores stored in the Database.
Bootstrap was used in order to enable a responsive design. While this is true, the Game only works for a sufficient Screen-Size.

Static holds the CSS-file style.css & the Javascript-file script.js
**style.css** holds most of the styling of the webpage based on classes which are then used in index.html. Most elements of the index.html have a unique class associated to them. Reflecting on the process this was not ideal, as alot of basic styling is done for each class which could have been inheritet given a <div> element (for example the coloring of the background and styling of the font). 

**script.js** is the main file in which the entire Game-Logic is defined. The general idea was to create a canvas in the html-document which is then used in the JS file to draw objects in.
Hence the first statment in the JavaScript file defines the constant canvas by accessing the ElementId of the canvas from the html-document. Afterwards numerous variables are defined, starting by the width and height of the canvas and ending with various variable used to handle Game-Logic. This is probably not the best way to design the Game but given a lack of expertise in JavaScript it is sufficient to handle all the various canvas states.

1. InputHandler defines a class which is used in order to enable the movement of the Snake. The movement logic is based on the original SNAKE-Game where pressing of a button changes the direction of the SNAKE. Besides mvmt-options InputHandler also allows for basic option controll (mainly pausing and restarting the game).
2. Snake defines a class which is used to creating the Snake controlled by the player and handling various events. The position of the SNAKE is fixed to the middle of the canvas at the beginning while the size of the head and each body-part is derived from the canvas size in order to enable a consisten movement-pattern without overlap. The update method checks if the InputHandler object has a valid key in order to change the position of the Snake and draw each part of the Snake. Check_contact checks if the Snake head touches Food which then increases the Score. Fail condition lastly checks if the Head of the Snakes touches it body which would result in a Game Over.
3. Food defines a class which is used to spawn food objects inside the canvas. the do-while loop is implemented in order to ensure that the food (which spawns at a random position) never spawns in a place the Snake is.

Afterwards the objects based on the classes are initalized and the functions outside the classes are defined. Animation of the Snake is down by calling a recursive function animate, this is combined with a counter to reduce the speed of which a frame is created. The game_speed variable can be changed to change the frequency of a new Frame.
Lastly the function handleGameLogic is used to handle the different states of the canvas. As long as a valid input is stored inside the inputhandler object the canvas is cleared and an updated version of the Snake and the Food is drawn upon it. Afterwards check_contact and fail_condition of the SNake object are called. If the user presses Escape the game is paused. If the user THAN presse backspace the game is ended and it returns to the home screen.
Different Screens are created by hiding or showing different buttons on the html-page. This was done as it provided an easy to implement solution in order to handle different states of the Webpage.





