"use strict"

// key variables

const left = 37
const up = 38
const right = 39
const down = 40

let pressed_key = right

// snake variables

const canvas = $('#canvas')[0]
const ctx = canvas.getContext('2d')
const scoreSpan = $('#status')

// game variables

let block_size = 10
let snake_size = 0
let score = 0
let time = 100
let timeForFood = time * 10
let food_time = timeForFood
let snake_width = block_size
let snake_height = block_size

const canvas_width = $(canvas).attr('width')
const canvas_height = $(canvas).attr('height')

const snake = [
    {x: 50, y: canvas_height / 2, oldX: 50, oldY: canvas_height/2},
    {x: 60, y: canvas_height / 2, oldX: 60, oldY: canvas_height/2},
    {x: 70, y: canvas_height / 2, oldX: 70, oldY: canvas_height/2},
    {x: 80, y: canvas_height / 2, oldX: 80, oldY: canvas_height/2},
]

const food = {x: 100, y: 100, eaten: false}

// snake functions

function spawnFood() {
    ctx.fillStyle = "red"
    ctx.fillRect(food.x, food.y, block_size, block_size)
    console.log(food.x, food.y)
}

function update() {
    snake_size = snake.length

    $(snake).each((index, value) => {
        // update old position of snake

        snake[index].oldX = value.x
        snake[index].oldY = value.y

        // fill and log it

        ctx.fillStyle = "green"
        ctx.fillRect(value.x, value.y, snake_width, snake_height)

        // eat the food with head

        if (index === 0) {
            if (eat(value.x, value.y)) {
                score++
                scoreSpan.text(score)
            }
        }

        console.log(value.x, value.y, snake_size, score)
    })
}

function eat(x, y) {
    return food.x === x && food.y === y
}

function move() {
    $(snake).each((index, value) => {
        // if this is the head of the snake

        if (index === 0) {
            switch (pressed_key) {
                case left:
                    snake[index].x = value.x - block_size
                    break

                case up:
                    snake[index].y = value.y - block_size
                    break

                case down:
                    snake[index].y = value.y + block_size
                    break

                case right:
                    snake[index].x = value.x + block_size
                    break

                default:
                    console.log("Unknown Key!")
            }
        } else {
            snake[index].x = snake[index - 1].oldX
            snake[index].y = snake[index - 1].oldY
        }
    })
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function loop() {
    move()
    clear()
    spawnFood()
    update()
}

function check(temp_key) {
    let key;

    switch (temp_key) {
        case down:
            key = (pressed_key !== up) ? temp_key : pressed_key
            break

        case up:
            key = (pressed_key !== down) ? temp_key : pressed_key
            break

        case left:
            key = (pressed_key !== right) ? temp_key : pressed_key
            break

        case right:
            key = (pressed_key !== left) ? temp_key : pressed_key
            break

        default:
            key = pressed_key
    }

    return key
}

// event handlers

$(document).ready(() => {
    // game loop

    setInterval(loop, time)


    $(document).keydown((event) => {
        event.preventDefault()

        pressed_key = check(event.which)
    })
})


