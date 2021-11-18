const express = require('express');

const app = express();
const PORT = 80;
const cors = require('cors');
const routes = require('./routes');
const uploadRoutes = require('./routes/uploadRoutes')

const corsOptions = {
  methods: 'GET, POST, DELETE',
  exposedHeaders: 'Content-Disposition',
};

function errorHandler(err, req, res, next) {
  return res.status(404).json(err);
}

app.use(cors(corsOptions));
app.use('/api', routes);
app.use('/upload', uploadRoutes);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Connection running on Port: ${PORT}`));
