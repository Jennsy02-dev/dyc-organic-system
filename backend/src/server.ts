import app from './app.js';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend de D' Y&C ORGANIC corriendo en http://localhost:${PORT}`);
});