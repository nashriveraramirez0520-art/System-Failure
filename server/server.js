import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

function generateRoomCode() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}

io.on('connection', (socket) => {
  console.log(`Jugador conectado: ${socket.id}`);

  // CREAR SALA
  socket.on('create-room', () => {
    const roomCode = generateRoomCode();

    socket.join(roomCode);

    console.log(`Sala creada: ${roomCode} por ${socket.id}`);

    socket.emit('room-created', roomCode);
  });

  // UNIRSE A SALA
  socket.on('join-room', (roomCode) => {
    const room = io.sockets.adapter.rooms.get(roomCode);

    if (!room) {
      socket.emit('join-error', 'La sala no existe.');
      return;
    }

    if (room.size >= 2) {
      socket.emit('join-error', 'La sala está llena.');
      return;
    }

    socket.join(roomCode);

    console.log(`Jugador ${socket.id} entró a la sala ${roomCode}`);

    socket.emit('room-joined', roomCode);

    io.to(roomCode).emit('players-ready');
  });

  // DESCONEXIÓN
  socket.on('disconnect', () => {
    console.log(`Jugador desconectado: ${socket.id}`);
  });
});

const PORT = 3000;

httpServer.listen(PORT, () => {
  console.log(`LUNARIS-01 server online on port ${PORT}`);
});