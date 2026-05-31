import app from './app';
import { config } from './config';

app.listen(config.port, () => {
  console.log(`StockFlow API corriendo en http://localhost:${config.port}`);
});