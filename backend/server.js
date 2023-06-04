require('colors');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const friendRoutes = require('./routes/friendRoutes');
const messageRoutes = require('./routes/messageRoutes');
const utilRoutes = require('./routes/utilRoutes');
const callRoutes = require('./routes/callRoutes');
const errorMiddleware = require('./middlewares/errors');

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://chatala-frontend.vercel.app',
    'https://chatala-kltn.vercel.app',
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

process.on('uncaughtException', (err) => {
  console.log('ERROR: ' + err.stack);
  console.log('Shutting down the server due to Uncaught Exception');
  process.exit(1);
});

dotenv.config();

const app = express();
app.use(cors(corsOptions));
app.use(express.json()); //allow accept json data
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

//connect DB
connectDB();

const server = app.listen(
  PORT,
  console.log(
    `Server started on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`
      .yellow.bold
  )
);

// config socket
const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: [
      'http://localhost:3000',
      'https://chatala-frontend.vercel.app',
      'https://chatala-kltn.vercel.app',
    ],
    credentials: true, //access-control-allow-credentials:true
  },
});

// all connected user
let users = [];

// {
//   uid,
//   socketid,
// }

const addUser = (uid, socketId) => {
  !users.some((user) => user.uid === uid) && users.push({ uid, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

io.on('connection', (socket) => {
  console.log('A user connected'.magenta.bold);

  socket.on('logged', (uid) => {
    addUser(uid, socket.id);
    io.emit('getUsers', users);
  });

  socket.on('join new room', (oldRoomId, newRoomId) => {
    socket.leave(oldRoomId);
    socket.join(newRoomId);
  });

  socket.on('logout', (roomId) => {
    socket.leave(roomId);
    removeUser(socket.id);
    io.emit('getUsers', users);
    console.log('A user logout');
  });

  socket.on('typing', (roomId) => {
    socket.to(roomId).emit('typing');
  });

  socket.on('stop typing', (roomId) => {
    socket.to(roomId).emit('stop typing');
  });

  socket.on('sendFriendRequest', (receiveId) => {
    const receiveUser = users.find(
      (user) => user.uid.toString() === receiveId.toString()
    );
    if (receiveUser) {
      socket.to(receiveUser.socketId).emit('receiveFriendRequest');
    }
  });

  socket.on('new room', (receiveId) => {
    const receiveUser = users.find(
      (user) => user.uid.toString() === receiveId.toString()
    );
    receiveUser && socket.to(receiveUser.socketId).emit('new room');
  });

  socket.on('friend noti', (receiveId) => {
    const receiveUser = users.find(
      (user) => user.uid.toString() === receiveId.toString()
    );
    receiveUser && socket.to(receiveUser.socketId).emit('friend noti');
  });

  socket.on('friend cancel', (receiveId) => {
    const receiveUser = users.find(
      (user) => user.uid.toString() === receiveId.toString()
    );
    receiveUser && socket.to(receiveUser.socketId).emit('friend cancel');
  });

  socket.on('unfriend', ({ friendRelateId, receiveId }) => {
    const receiveUser = users.find(
      (user) => user.uid.toString() === receiveId.toString()
    );
    receiveUser && socket.to(receiveUser.socketId).emit('unfriended');
  });

  socket.on('unsend msg', (receiveId, msgId) => {
    const receiveUser = users.find(
      (user) => user.uid.toString() === receiveId.toString()
    );
    receiveUser && socket.to(receiveUser.socketId).emit('unsend msg', msgId);
  });

  socket.on('delete msg', (receiveId, msgId) => {
    const receiveUser = users.find(
      (user) => user.uid.toString() === receiveId.toString()
    );
    receiveUser && socket.to(receiveUser.socketId).emit('delete msg', msgId);
  });

  socket.on('sendFiles', (roomId, files) => {
    // console.log(receiveId, files);
    socket.to(roomId).emit('receiveFiles', files);
  });

  socket.on('makecall', (callInfo) => {
    const { meetingId, callerId, receiverIds } = callInfo;
    const receiverArr = receiverIds.split(',');

    receiverArr.forEach((it) => {
      const receiverId = users.find((u) => u.uid === it);
      receiverId &&
        socket
          .to(receiverId.socketId)
          .emit('receiveCall', { meetingId, callerId });
    });
  });

  socket.on('acceptCall', (callInfo) => {
    const user = users.find((u) => u.uid === callInfo.callerId);
    user &&
      socket
        .to(user.socketId)
        .emit('callaccepted', { meetingId: callInfo.meetingId });
  });

  socket.on('cancelCall', (callInfo) => {
    const { receiverIds } = callInfo;
    const receiverArr = receiverIds.split(',');

    receiverArr.forEach((it) => {
      const receiverId = users.find((u) => u.uid === it);
      receiverId && socket.to(receiverId.socketId).emit('callCanceled');
    });
  });

  socket.on('declineCall', (callInfo) => {
    const user = users.find((u) => u.uid === callInfo.callerId);
    user && socket.to(user.socketId).emit('callDeclined');
  });

  socket.on('groupname', (roomId, roomUserIds, groupName) => {
    const _users = users.filter((u) => roomUserIds.includes(u.uid));
    if (_users.length > 0) {
      _users.forEach((u) => {
        socket.to(u.socketId).emit('receivegroupname', { roomId, groupName });
      });
    }
  });

  socket.on('addmember', (uid) => {
    const user = users.find((u) => u.uid === uid);
    user && socket.to(user.socketId).emit('addmember');
  });

  socket.on('kickmember', ({ uid, roomId }) => {
    const user = users.find((u) => u.uid === uid);
    user && socket.to(user.socketId).emit('kickmember', roomId);
  });

  socket.on('memberLeaveGroup', ({ roomId, username, roomUsers }) => {
    const roomUserIds = [];
    roomUsers.forEach((user) => roomUserIds.push(user.uid));

    const _users = users.filter((u) => roomUserIds.includes(u.uid));
    if (_users.length > 0) {
      _users.forEach((u) => {
        socket.to(u.socketId).emit('memberLeaveGroup', { roomId, username });
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected'.gray.bold);
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});

app.get('/', (req, res) => {
  res.send('server is ready!');
});

// pass io object to controller
app.use(function (req, res, next) {
  req.io = io;
  next();
});

//route
app.use('/api/user', userRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/friend', friendRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/util', utilRoutes);
app.use('/api/call', callRoutes);

//middleware
app.use(errorMiddleware); //handle error
