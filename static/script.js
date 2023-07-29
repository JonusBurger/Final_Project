const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 400;
const CANVAS_HEIGHT = canvas.height = 400;
const GAME_SIZE = 10; // Defines sizes of Object in the game
let game_speed = 10; // Defines Game_speed
let score = 0; // stores the Score for the current game 
let counter = 0; // Keeps track of current Frame
let mvmt_occured = true; // variable storing if a mvmt was applied or not
let backspace_enabled = false; // this is used in order to enable going back to main menu
let game_lost = false;
const allowed_mvmt = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight']; // Defines mvmt controlls
const allowed_options = ['Escape']; // Defines option controlls

// Handler Listening for User-Input
class InputHandler {
    constructor(){
        this.key = '';
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    handleKeyDown(e){
        e.preventDefault(); // prevents scrolling from occuring
        if (mvmt_occured && e.key != this.key){  // prevents mvmt from registring before older mvmt was applied
            if (allowed_mvmt.includes(e.key)){
                this.key = e.key;
                mvmt_occured = false; 
            } 
            else if (allowed_options.includes(e.key)){
                this.key = e.key;
            }
            else if (e.key === 'Backspace' && backspace_enabled){ //Backspace only enabled after ESC was pressed
                this.key = e.key;
            }
        }
    }
}


// Snake is the class of the player object
class Snake {
    constructor(CANVAS_WIDTH, CANVAS_HEIGHT){
        this.x = Math.floor(CANVAS_WIDTH/(2*GAME_SIZE)) * GAME_SIZE;
        this.y = Math.floor(CANVAS_HEIGHT/(2*GAME_SIZE)) * GAME_SIZE;
        this.width = GAME_SIZE;
        this.height = GAME_SIZE;
        this.step_size = GAME_SIZE;
        this.body = []; // Stores body parts of the Snake
    }
    draw(context){
        context.fillStyle = 'white';
        // append new position to beginning of body array
        this.body.unshift({x: this.x, y: this.y});
        //draw rest of Body
        for (let i = 0; i < this.body.length; i++){
            if (i == (this.body.length - 1) && i > 0){
                this.body.splice(i, 1); // Removes last entry from list
            }
            else {
                context.fillRect(this.body[i].x, this.body[i].y, this.width, this.height);
            }
        }
    }
    update(input){
        switch (input.key) {
            case 'ArrowDown':
                this.y += this.step_size;
                if (this.y >= CANVAS_HEIGHT){
                    this.y = 0;
                }
                break;
            case 'ArrowUp':
                this.y -= this.step_size;
                if (this.y < 0){
                    this.y = CANVAS_HEIGHT - GAME_SIZE; //Minus to ensure not outside of Canvas
                }
                break;
            case 'ArrowRight':
                this.x += this.step_size;
                if (this.x >= CANVAS_WIDTH){
                    this.x = 0;
                }
                break;
            case 'ArrowLeft':
                this.x -= this.step_size;
                if (this.x < 0){
                    this.x = CANVAS_WIDTH - GAME_SIZE; //Minus to ensure not outside of Canvas
                }
            default:
                break;
        }
        mvmt_occured = true;
    }
    check_contact(item){
        if (this.y != item.y || this.x != item.x){
                return false;
        }
        else{
            score++; // increases score everytime an item is touched
            document.getElementById("score").innerHTML = score; // changes score on html side
            return true;
        }
    }
    fail_condition(){
        // search array of body and checks if current position is found (excluding first entry of body)
        if (this.body.slice(1,this.body.length).find(entry => (entry.x === this.x && entry.y === this.y))){
            return true;
        }
        else{
            return false;
        }
    }
};


// Food is the class of items spawned in the game
class Food {
    constructor(snake = {body: []}){
        this.width = GAME_SIZE;
        this.height = GAME_SIZE;
        this.spawnFood(snake);
    }
    spawnFood(snake){
        // Constructs food while ensuring food never spawns on a pixel where the snake body is
        do {
            this.x = Math.floor(Math.random() * (canvas.width - GAME_SIZE) / GAME_SIZE) * GAME_SIZE;
            this.y = Math.floor(Math.random() * (canvas.height - GAME_SIZE) / GAME_SIZE) * GAME_SIZE;
        } while (snake.body.find(entry => (entry.x === this.x && entry.y === this.y)));
    }
    draw(context){
        context.fillStyle = 'white';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
};


// initalizes classes
const input = new InputHandler();
let snake = new Snake(CANVAS_WIDTH, CANVAS_HEIGHT);
let food = new Food(snake);


// Function for sending Score to Backend
async function sendInfo() {
    try {
        const response = await fetch(`/process/${JSON.stringify(score)}`, {
            method: 'POST'
        });
        const flaskMessage = await response.text();
        console.log(flaskMessage);
    } catch (error) {
        console.error(error);
    }
}


// Function for toggeling elements on and off
function Hide(elementid, toggle) {
    let element = document.getElementById(elementid);
    element.style.display = ( toggle ) ? "none" : "block";
};


// Enables Game Over window & resets score
function game_over(){
    game_lost = true;
    sendInfo();
    Hide("button_go", false);
    document.getElementById("score").innerHTML = 0; // changes score on html side
}


// function for animation-loop
async function animate(){
    if (game_lost) {
        return;
    }
    if (counter % game_speed == 0){
        handleGameLogic();
    }
    counter++;
    requestAnimationFrame(animate);
};


// function for handeling Game Logic
function handleGameLogic(){
    switch (input.key){
        // Condition to enable Pause-function
        case 'Escape':
            Hide("button_pa", false);
            backspace_enabled = true;
            break;
        // Condition for allowing Main Meun access
        case 'Backspace':
            end_game();
            break;
        default:
            if (allowed_mvmt.includes(input.key)){
                backspace_enabled = false; // disables backspace for jumping to main menu
                Hide("button_pa", true); // hides pause button
                ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                snake.draw(ctx);
                food.draw(ctx);
                // Checks if snake touches Food
                if (snake.check_contact(food)){
                    food = new Food(snake);
                    food.draw(ctx);
                    snake.body.push(snake.body[snake.body.length -1]) // Increase Body of Snake
                }
                snake.update(input);
                // Check if Snake Head touches Body
                if (snake.fail_condition()){
                    game_over();
                }
            }
    }
}


// function for resetting all values before starting a new game
function reset(){
    input.key = ''; // resets value of event handler
    mvmt_occured = true;
    snake = new Snake(CANVAS_WIDTH, CANVAS_HEIGHT);
    food = new Food(snake);
    game_lost = false; // reset game state
    counter = 0;
    score = 0;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // clears canvas (If Game was run before)
    snake.draw(ctx); // Draws objects before animation loop is started
    food.draw(ctx); // Draws objects before animation loop is started
}


// Main function for running the game
function run_game(){
    // Hidding Buttons
    Hide("button_st", true);
    Hide("button_go", true);
    Hide("button_ch", true);
    // Display Canvas
    Hide("div_canvas", false);
    // initalizes classes and objects
    reset();
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // clears canvas (If Game was run before)
    snake.draw(ctx); // Draws objects before animation loop is started
    food.draw(ctx); // Draws objects before animation loop is started
    // starts main game loop
    animate();
};


// Function for Handeling end of a Game
function end_game(){
    // display main menu buttons
    Hide("button_st", false);
    Hide("button_ch", false);
    // disable canvas and pause button
    Hide("div_canvas", true);    
    Hide("button_pa", true);
    game_lost = true;
    document.getElementById("score").innerHTML = 0; // changes score on html side
};