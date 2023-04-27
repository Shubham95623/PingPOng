const app=require('express')()

var http=require('http')
const server=http.createServer(app)
var path=require('path')
const cors = require('cors');
const socket=require('socket.io')
// const io = require("socket.io")(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//     },
//   });

var balls={
    xpos:150,
    ypos:200,
    radius:10,
    color:"green",
    speed:4,
    dx:4,
    dy:4,
  }

//   punk:{
//     xpos:185
//     ypos:490
//     height:5
//     width:80
//     color:"blue"
//     speed:1
//   }


//   punk1:{
//     xpos:185
//     ypos:50
//     height:5
//     width:80
//     color:"blue"
//     speed:1
//   }

score1=0
score2=0

room=1

  const io =  socket(server,{ cors: { origin: "*" , methods: ["GET", "POST"],},})

users=0
const user=[]
// Assuming 'io' is your EventEmitter instance
// io.setMaxListeners(50);


io.on('connection',(socket)=>{

    // io.setMaxListeners(25);
socket.join("room-"+room)


        user.push(socket.id)
    users++
    console.log(user)
    // socket.emit(socketid,socket.id)

    console.log(room+"  "+users);



socket.on('movePunk',(data)=>{
    if(data[1]==user[1])
    io.sockets.in("room-"+room).emit('stateUpdate1',data)

    if(data[1]==user[0]){
io.sockets.in("room-"+room).emit('stateUpdate',data)
 }

    })




socket.on('disconnect',()=>{
    users--
    var index=user.indexOf(socket.id)
    
    if (index !== -1) {
        user.splice(index, 1); 
    }
    
    console.log(user+"  "+users);

})







  if(users==2)
socket.on('moveBall',(ball)=>{
// setInterval(()=>{
        if (balls.xpos + balls.radius > 547) {
            balls.dx = -balls.dx;
        }
        if (balls.xpos - balls.radius < 3) {
            balls.dx = -balls.dx;
   
        }
        if (balls.ypos - balls.radius < 3) {
            balls.dy = -balls.dy;

        }
        if (balls.ypos + balls.radius > 547) {
            balls.dy = -balls.dy;
        }

        if (
            ((ball[1].xpos < balls.xpos + balls.radius ) && (balls.xpos < ball[1].xpos + ball[1].width + balls.radius +1) && (ball[1].ypos < balls.ypos + balls.radius - 1) && (balls.ypos-balls.radius<ball[1].ypos+ball[1].height) )
             || 
            ((ball[2].xpos <= balls.xpos + balls.radius+1) && (balls.xpos <= ball[2].xpos + ball[2].width + balls.radius +1) && (ball[2].ypos +ball[2].height >= balls.ypos - balls.radius - 1)  && (balls.ypos+balls.radius>ball[2].ypos))  
            
            ) {
          
            balls.dy= -balls.dy;
        }
        // console.log(balls)
        
        balls.xpos += balls.dx;
        balls.ypos += balls.dy;
        
        // console.log(balls)
        // setInterval(()=>{

        //    socket.to("room-"+room).emit('ballState',balls)
            io.sockets.in("room-"+room).emit('ballState',balls)
        // },20)

if((balls.ypos>= 540)&& (balls.xpos>=170) && (balls.xpos<=340) ){
score1++
io.sockets.in("room-"+room).emit('updateScore1',score1)
}
if((balls.ypos<= 30)&& (balls.xpos>=170) && (balls.xpos<=340) ){
score2++
// io.sockets.in("room-"+room).emit('updateScore2',score2)
io.sockets.in("room-"+room).emit('updateScore2',score2)
}
    })





if(users%2==0){
    room;
    // users=0;
    console.log(room, users);
}

})



server.listen(3000,()=>{
console.log('user is ready');
})



