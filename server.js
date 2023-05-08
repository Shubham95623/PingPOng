const app = require('express')()
var http = require('http')
const server = http.createServer(app)
var path = require('path')
const cors = require('cors');
const socket = require('socket.io')

var balls = {
    xpos: 150,
    ypos: 200,
    radius: 10,
    color: "green",
    speed: 4,
    dx: 3,
    dy: 3,
}

score1 = 0
score2 = 0






const io = socket(server, { cors: { origin: "*", methods: ["GET", "POST"], }, })

i = 0
const user = []

io.setMaxListeners(50);


io.on('connection', (socket) => {





    i++;

    user.push(socket.id)


    console.log(user)



    socket.on('movePunk', (data) => {
        if (data[1] == user[1]) {


            if (data[2] < 12) {
                data1 = 12
            }
            else if (data[2] > 465) {
                data1 = 465
            }
            else
                data1 = data[2]

            io.sockets.emit('stateUpdate1', data1)
        }
        if (data[1] == user[0]) {


            if (data[0] < 12) {
                data1 = 12
            }
            else if (data[0] > 465) {
                data1 = 465
            }
            else
                data1 = data[0]

            io.sockets.emit('stateUpdate', data1)
        }

    })




    socket.on('disconnect', () => {
        i--
        var index = user.indexOf(socket.id)
        if (index !== -1) {
            user.splice(index, 1);
        }
        console.log(user + "  " + i);


        if (i == 0) {
            score1 = 0
            score2 = 0

            balls = {
                xpos: 150,
                ypos: 200,
                radius: 10,
                color: "green",
                speed: 4,
                dx: 3,
                dy: 3,
            }


        }



    })







    if (i == 2)
        socket.on('moveBall', (ball) => {
          
            if (balls.xpos + balls.radius > 547) {
                balls.dx = -balls.dx;
                // balls.dx = -3;
            }
            else if (balls.xpos - balls.radius < 3) {
                balls.dx = -balls.dx;
                // balls.dx = -3;
            }
            else if (balls.ypos - balls.radius < 3) {
                balls.dy = -balls.dy;
                // balls.dy = -3;
            }
            else if (balls.ypos + balls.radius > 547) {
                balls.dy = -balls.dy;
                // balls.dy = -3;
            }


            else if
                ((ball[1].xpos - 2 < balls.xpos + balls.radius) && (balls.xpos < ball[1].xpos + ball[1].width + 2 + balls.radius) && (ball[1].ypos < balls.ypos + balls.radius - 1) && (balls.ypos - balls.radius < ball[1].ypos + ball[1].height)) {

                balls.dy = -balls.dy;
                balls.dx = ball[0] * 65 / 100 + balls.dx;

            }

            else if ((ball[2].xpos - 2 <= balls.xpos + balls.radius * 1.41) && (balls.xpos <= ball[2].xpos + ball[2].width + 2 + balls.radius * 1.41) && (ball[2].ypos + ball[2].height >= balls.ypos - balls.radius - 1) && (balls.ypos + balls.radius > ball[2].ypos)) {
                balls.dy = -balls.dy;
                balls.dx = ball[0] * 65 / 100 + balls.dx;

            }

            if (Math.abs(balls.dx) > 7) {
                balls.dx = balls.dx / Math.abs(balls.dx) * 7
            }


            balls.xpos += balls.dx;
            balls.ypos += balls.dy;



            io.sockets.emit('ballState', balls)

            if ((balls.ypos >= 538) && (balls.xpos >= 170) && (balls.xpos <= 340)) {
                score1++
                io.sockets.emit('updateScore1', score1)
            }
            if ((balls.ypos <= 12) && (balls.xpos >= 170) && (balls.xpos <= 340)) {
                score2++
                io.sockets.emit('updateScore2', score2)
            }
        })


})




if (i == 0) {
    score1 = 0
    score2 = 0
    balls = {
        xpos: 150,
        ypos: 200,
        radius: 10,
        color: "green",
        speed: 4,
        dx: 3,
        dy: 3,
    }
}



server.listen(3000, () => {
    console.log('user is ready');
})

