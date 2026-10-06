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

  // =========================================================
  // CREAR SALA
  // =========================================================

  socket.on('create-room', () => {
    const roomCode = generateRoomCode();

    socket.join(roomCode);

    // Guardamos la sala actual de este jugador.
    socket.data.roomCode = roomCode;

    console.log(`Sala creada: ${roomCode} por ${socket.id}`);

    socket.emit('room-created', roomCode);
  });

  // =========================================================
  // UNIRSE A SALA
  // =========================================================

  socket.on('join-room', (roomCode) => {
    const normalizedRoomCode = roomCode.trim().toUpperCase();

    const room = io.sockets.adapter.rooms.get(normalizedRoomCode);

    if (!room) {
      socket.emit('join-error', 'La sala no existe.');
      return;
    }

    if (room.size >= 2) {
      socket.emit('join-error', 'La sala está llena.');
      return;
    }

    socket.join(normalizedRoomCode);

    // Guardamos también la sala del segundo jugador.
    socket.data.roomCode = normalizedRoomCode;

    console.log(
      `Jugador ${socket.id} entró a la sala ${normalizedRoomCode}`
    );

    socket.emit('room-joined', normalizedRoomCode);

    io.to(normalizedRoomCode).emit('players-ready');
  });

  // =========================================================
  // MOVIMIENTO DEL JUGADOR
  // =========================================================

  socket.on('player-move', (playerData) => {
    const roomCode = socket.data.roomCode;

    if (!roomCode) {
      return;
    }

    // Envía el movimiento a todos los demás jugadores
    // de ESTA sala, pero no de vuelta al jugador que lo envió.
    socket.to(roomCode).emit('player-moved', {
      id: socket.id,
      position: playerData.position,
      rotation: playerData.rotation,
    });
  });

  // =========================================================
  // DESCONEXIÓN
  // =========================================================

  socket.on('disconnect', () => {
    const roomCode = socket.data.roomCode;

    if (roomCode) {
      socket.to(roomCode).emit('player-left', socket.id);
    }

    console.log(`Jugador desconectado: ${socket.id}`);
  });
});

const PORT = 3000;

httpServer.listen(PORT, () => {
  console.log(`LUNARIS-01 server online on port ${PORT}`);
});