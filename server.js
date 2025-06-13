const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/forms', require('./routes/formroutes'));


// Load routes
// e.g., app.use('/api/forms', require('./routes/formRoutes'));

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('join-form', (formId) => {
    socket.join(formId);
    console.log(`User joined form ${formId}`);
  });

  socket.on('update-field', ({ formId, field, value }) => {
    socket.to(formId).emit('field-updated', { field, value });

    // Save to DB here (optional or debounced)
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
