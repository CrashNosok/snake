"use strict"

const canvas = document.getElementById('game');

// контекст. указываем, что 2д игра
const ctx = canvas.getContext('2d')

const ground = new Image();
ground.src = "img/ground.png"

const foodImg = new Image();
foodImg.src = "img/food.png"

// размеры квадратика
let box = 32;
// очки
let score = 0;

// координаты еды
let food = {
    // диапазон от 1 до 17
    x: getX(),
    y: getY(),
};

// змейка. её длина
let snake = [{x: 9 * box, y: 10 * box}];
// голова змейки в начале (в центре)
// snake[0] = {
//     x: 9 * box,
//     y: 10 * box,
// };

// заставим змейку двигаться. создадим обработчик события keydown
// будет отслеживать куда нажимаем на клавиатуре
document.addEventListener('keydown', direction);

// содержит инфу о том, куда нажали
let dir;

// определяет на что нажали
function direction(event){
    // стрелочка влево
    if(event.keyCode == 37 && dir != 'right')
        dir = 'left';
    else if(event.keyCode == 38 && dir != 'down')
        dir = 'up';
    else if(event.keyCode == 39 && dir != 'left')
        dir = 'right';
    else if(event.keyCode == 40 && dir != 'up')
        dir = 'down';
}

// проверка на то, чтобы не ел хвост
function eatTail(head, arr) {
    for(let i = 0; i < arr.length; i++){
        if (head.x == arr[i].x && head.y == arr[i].y)
            clearInterval(game);
    }
}

// рисуем картинки внутри canvas
function drowGame() {
    // рисует картинку в определённых координатах (картинка, х, у)
    ctx.drawImage(ground, 0, 0);

    // рисуем еду
    ctx.drawImage(foodImg, food.x, food.y);

    // рисуем змейку
    for (let i = 0; i < snake.length; i++){
        // цвет квадрата
        ctx.fillStyle = i == 0 ? 'green' : 'red';
        // создаём квадрат. (x, y, width, height)
        ctx.fillRect(snake[i].x, snake[i].y, box, box)
    }
    // рисуем текст
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    // пишем текст (текст, х, у)
    ctx.fillText(score, box * 2.5, box * 1.7)

    // рисуем передвижение змейки
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // проверка на кушанье еды
    if (snakeX == food.x && snakeY == food.y){
        let x;
        let y;

        score++;
        x = getX();
        y = getY();
        for (let i = 0; i < snake.length; i++){
            if (x == snake[i].x && y == snake[i].y){
                x = getX();
                y = getY();
                i = 0;
            }
        }
        food.x = x;
        food.y = y;
    } else {
        // удалили последний эл-т
        snake.pop();
    }

    // проверка на выход за игровое поле
    if (snakeX < box || snakeX > box * 17
        || snakeY < 3 * box || snakeY > box * 17)
        clearInterval(game);

    if (dir == 'left') snakeX -= box;
    if (dir == 'right') snakeX += box;
    if (dir == 'up') snakeY -= box;
    if (dir == 'down') snakeY += box;

    // переносим удалённый эл-т
    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    eatTail(newHead, snake);

    snake.unshift(newHead);
}
// ф-ию drowGame() нужно вызывать каждые 100мс ч/з интервал
let game = setInterval(drowGame, 100);

function getX(){
    let x;

    x = Math.floor((Math.random() * 17 + 1)) * box;
    return x;
}

function getY(){
    let y;

    y = Math.floor((Math.random() * 15 + 3)) * box;
    return y;
}

// function gameOver(){

//     let question = confirm("хотите начать сначала?");
//     if (question){
//         score = 0;
//         snake = [{x: 9 * box, y: 10 * box}];
//         game = setInterval(drowGame, 100);
//     } else {
//         clearInterval(game);
//     }
// }
