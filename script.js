"use strict"

const left = 37
const up = 38
const right = 39
const down = 40

let pressed_key = right

const canvas = $('#canvas')[0]
const ctx = canvas.getContext('2d')
const scoreSpan = $('#status')

let block_size = 10
let snake_size = 0
let score = 0
let time = 100
let snake_width = block_size
let snake_height = block_size
let interval = 0

const canvas_width = $(canvas).attr('width')
const canvas_height = $(canvas).attr('height')

const default_snake = [
    {x: 50, y: canvas_height / 2, oldX: 50, oldY: canvas_height / 2},
    {x: 60, y: canvas_height / 2, oldX: 60, oldY: canvas_height / 2},
]
let snake = default_snake
let food = {x: 100, y: 100, eaten: false}

function spawnFood() {
    ctx.fillStyle = "#dc3545"

    if (food.eaten) {
        food = spawnNewFood()
    }

    ctx.fillRect(food.x, food.y, block_size, block_size)
}

function spawnNewFood() {
    let xArr = [], yArr = []

    $(snake).each((value, index) => {
        if ($.inArray(value.x, xArr) !== -1) {
            xArr.push(value.x)
        }

        if ($.inArray(value.y, yArr) !== -1) {
            yArr.push(value.y)
        }
    })

    return getEmptyXY(xArr, yArr)
}

function getEmptyXY(xArr, yArr) {
    let emptyX = randomNumber(canvas_width - block_size, block_size)
    let emptyY = randomNumber(canvas_height - block_size, block_size)

    if ($.inArray(emptyX, xArr) === -1 && $.inArray(emptyY, yArr) === -1) {
        return {
            x: emptyX,
            y: emptyY,
            eaten: false
        }
    } else {
        return getEmptyXY(xArr, yArr)
    }
}

function randomNumber(maximum, multiple) {
    let res = Math.floor(Math.random() * maximum)
    res = (res % 10 === 0) ? res : res + (multiple - res % 10)
    return res
}

function update() {
    snake_size = snake.length

    $(snake).each((index, value) => {
        // update old position of snake

        snake[index].oldX = value.x
        snake[index].oldY = value.y

        // fill and log it

        ctx.fillStyle = "#198754"
        ctx.fillRect(value.x, value.y, snake_width, snake_height)

        // eat the food with head

        if (index === 0) {
            if (collide(value.x, value.y)) {
                stop()
            }

            else if (eaten(value.x, value.y)) {
                food.eaten = true

                // plus one for score and make the snake taller
                score++
                scoreSpan.text(score)
                extend()
            }
        }
    })
}

function start() {
    $('#danger-status').hide()
    snake = default_snake
    interval = setInterval(loop, time)
}

function stop() {
    clearInterval(interval)
    $('#danger-status').show()
}

function extend() {
    snake.push({
        x: snake[snake.length - 1].oldX,
        y: snake[snake.length - 1].oldY
    })
}

function collide(x, y) {
    return snake.filter(((value, index) => {
        return index !== 0 && value.x === x && value.y === y
    })).length > 0 || x < 0 || y < 0 || x > canvas_width || y > canvas_height
}

function eaten(x, y) {
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

    start()

/*    $('#restart-btn').click(() => {
        stop()
        start()
    })*/

    $(document).keydown((event) => {
        event.preventDefault()

        pressed_key = check(event.which)
    })
})


