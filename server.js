require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión MongoDB (usando variable de entorno)
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://Luis_Castro_Iturbide:juan13luis7@cluster0.nhgsaca.mongodb.net/esp32_data?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Modelo de datos
const DataSchema = new mongoose.Schema({
 //sensorID: Number,
  //accelerationX: Number,
  //accelerationY: Number,
  //accelerationZ: Number,
  //temperature: Number,
  //dominantFrequency: Number,
  //magnitude: Number,
  sensorID: Number,
  accelerationX: Number,
  accelerationY: Number,
  accelerationZ: Number,
  temperature: Number,
  dominantFrequency: Number,
  frequencyX: Number, // opcional si quieres guardar todos los ejes
  frequencyY: Number,
  frequencyZ: Number,
  magnitude: Number, 
  timestamp: { type: Date, default: Date.now }
});

const Data = mongoose.model('Data', DataSchema);

// Endpoint de prueba
app.get('/', (req, res) => {
  res.send('API de Intermediario ESP8266-MongoDB');
});

// Endpoint para recibir datos
app.post('/api/data', async (req, res) => {
  try {
    let result;
    if (Array.isArray(req.body)) {
      result = await Data.insertMany(req.body);
    } else {
      result = await Data.create(req.body);
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = app;