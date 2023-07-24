const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 400;
const CANVAS_HEIGHT = canvas.height = 400;
const GAME_SIZE = 10; // Defines sizes of Object in the game
let game_speed = 10; // Defines Game_speed 

// Handler Listening for User-Input
class InputHandler {
    constructor(){
        this.key = '';
        window.addEventListener('keydown', e => {
            if (e.key === 'ArrowDown'){
                this.key = 'down'            
            }
            if (e.key === 'ArrowUp'){
                this.key = 'up'            
            }
            if (e.key === 'ArrowLeft'){
                this.key = 'left'            
            }
            if (e.key === 'ArrowRight'){
                this.key = 'right'            
            }
            if (e.key == 'Escape'){
                this.key = 'esc';
            }   
        });
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
        if (input.key === 'down'){
            this.y += this.step_size;
            if (this.y >= CANVAS_HEIGHT){
                this.y = 0;
            }
        } else if (input.key === 'up'){
            this.y -= this.step_size;
            if (this.y < 0){
                this.y = CANVAS_HEIGHT - GAME_SIZE; //Minus to ensure not outside of Canvas
            }
        } else if (input.key === 'right'){
            this.x += this.step_size;
            if (this.x >= CANVAS_WIDTH){
                this.x = 0;
            }
        } else if (input.key === 'left'){
            this.x -= this.step_size;
            if (this.x < 0){
                this.x = CANVAS_WIDTH - GAME_SIZE; //Minus to ensure not outside of Canvas
            }
        }
    }
    check_contact(item){
        if (this.y != item.y || this.x != item.x){
                return false;
        }
        else{
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
    constructor(snake){
        let spawned = false;
        // Loops until food is spawned outside of snake body array
        while (spawned == false){
            this.x = Math.floor(Math.random() * (canvas.width - GAME_SIZE) / GAME_SIZE) * GAME_SIZE;
            this.y = Math.floor(Math.random() * (canvas.height - GAME_SIZE) / GAME_SIZE) * GAME_SIZE;
            // Condition to check if item was spawned at a snake body position
            if (!snake.body.find(entry => (entry.x === this.x && entry.y === this.y))){
                spawned = true;
            }
        }
        this.width = GAME_SIZE;
        this.height = GAME_SIZE;
    }
    draw(context){
        context.fillStyle = 'white';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
};


// Function for toggeling elements on and off
function Hide(elementid, toggle) {
    let element = document.getElementById(elementid);
    element.style.display = ( toggle ) ? "none" : "block";
};


const input = new InputHandler();
let snake = new Snake(CANVAS_WIDTH, CANVAS_HEIGHT);
let food = new Food(snake);
let counter = 0;
let stats = 0;


function game_over(){
    Hide("button_go", false);
    console.log("hello world!");
}


async function animate(){
    if (counter % game_speed == 0){
        // Condition to enable Pause-function
        if (input.key == 'esc'){
            Hide("button_pa", false);
        }
        else {
            Hide("button_pa", true);
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            snake.draw(ctx);
            food.draw(ctx)
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
                return;
            }
        }
    }
    counter++;
    requestAnimationFrame(animate);
};

// Main function for running the game
function run_game(){
    // Hidding Buttons
    Hide("button_st", true);
    Hide("button_go", true);
    // Display Canvas
    Hide("div_canvas", false);
    // initalizes classes and objects
    input.key = ''; // resets value of event handler
    snake = new Snake(CANVAS_WIDTH, CANVAS_HEIGHT);
    food = new Food(snake);
    counter = 0;
    // starts main game loop
    animate();
};
