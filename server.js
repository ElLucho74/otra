const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Conexión a MongoDB
const mongoURI = 'mongodb+srv://Luis_Castro_Iturbide:juan13luis7@cluster0.nhgsaca.mongodb.net/esp32_data?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Definir el esquema y modelo ANTES de las rutas
const dataSchema = new mongoose.Schema({
  sensorID: Number,
  accelerationX: Number,
  accelerationY: Number,
  accelerationZ: Number,
  temperature: Number,
  dominantFrequency: Number,
  magnitude: Number,
  timestamp: { type: Date, default: Date.now }
});

// Crear el modelo
const Data = mongoose.model('Data', dataSchema);

// Middleware
app.use(bodyParser.json());

// Ruta POST corregida
app.post('/api/data', async (req, res) => {
  try {
    // Si recibes un array de datos
    if (Array.isArray(req.body)) {
      const savedData = await Data.insertMany(req.body);
      return res.status(200).json({
        message: `${savedData.length} documentos insertados`,
        data: savedData
      });
    }
    
    // Si recibes un solo objeto
    const newData = new Data(req.body);
    const savedData = await newData.save();
    res.status(201).json(savedData);
    
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({
      error: 'Error al almacenar los datos',
      details: error.message
    });
  }
});

module.exports = app;