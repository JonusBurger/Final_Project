const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 400;
const CANVAS_HEIGHT = canvas.height = 400;
const GAME_SIZE = 10; // Defines sizes of Object in the game
let game_speed = 5;

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
        // console.log(this.key); 
        });
    }
}

// Idee Array mit Körperpositionen
// bei neuem Draw nimmt ändert Kopf Position
// alle anderen neben den Wert des vorherigen Arrays an


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
        console.log(this.body)
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
                this.y = CANVAS_HEIGHT;
            }
        } else if (input.key === 'right'){
            this.x += this.step_size;
            if (this.x >= CANVAS_WIDTH){
                this.x = 0;
            }
        } else if (input.key === 'left'){
            this.x -= this.step_size;
            if (this.x < 0){
                this.x = CANVAS_WIDTH;
            }
        }
    }
    check_contact(item){
        if ((this.y + this.width) < item.y || this.y > (item.y + item.width) ||
            (this.x + this.height) < item.x || this.x > (item.x + item.height)){
                return false;
        }
        else{
            return true;
        }
    }
};


class Food {
    constructor(snake){
        let spawned = false;
        // Loops until food is spawned outside of snake body array
        while (spawned == false){
            this.x = Math.floor(Math.random() * (canvas.width - GAME_SIZE) / GAME_SIZE) * GAME_SIZE;
            this.y = Math.floor(Math.random() * (canvas.height - GAME_SIZE) / GAME_SIZE) * GAME_SIZE;
            if (!snake.body.includes({x: this.x, y: this.y})){
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
}


const input = new InputHandler();
const snake = new Snake(CANVAS_WIDTH, CANVAS_HEIGHT);
let food = new Food(snake);
let counter = 0;

function animate(){
    if (counter % game_speed == 0){
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        snake.draw(ctx);
        snake.update(input);
        food.draw(ctx)
        // Checks if snake touches Food
        if (snake.check_contact(food)){
            food = new Food(snake);
            food.draw(ctx);
            snake.body.push(snake.body[snake.body.length -1]) // Increase Body of Snake
        }
    }
    counter++;
    requestAnimationFrame(animate);
};


animate();