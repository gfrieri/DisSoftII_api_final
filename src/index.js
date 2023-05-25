import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import csv from 'csv-parser';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const output = [];
const city_dpt = new Map();

fs.createReadStream('./data/DATOSFINAL.csv')
  .pipe(csv())
  .on('data', (data) => {
    output.push(data);
  })
  .on('end', () => {
    output.forEach((row) => {
      city_dpt.set(
        row['MUNICIPIO'],
        row['DEPARTAMENTO']
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
      );
    });
  });

app.use(cors());
app.use(morgan('dev'));

app.get('/city/:city', (req, res) => {
  switch (req.params.city) {
    case 'bogota':
      res.json({ city: 'bogota', dpt: 'cundinamarca' });
      break;
    case 'medellin':
      res.json({ city: 'medellin', dpt: 'antioquia' });
      break;
    case 'cali':
      res.json({ city: 'cali', dpt: 'valle del cauca' });
      break;
    case 'barranquilla':
      res.json({ city: 'barranquilla', dpt: 'atlantico' });
      break;
    case 'cartagena':
      res.json({ city: 'cartagena', dpt: 'bolivar' });
      break;
    case 'bucaramanga':
      res.json({ city: 'bucaramanga', dpt: 'santander' });
      break;
    case 'santa marta':
      res.json({ city: 'santa marta', dpt: 'magdalena' });
      break;
    case 'valledupar':
      res.json({ city: 'valledupar', dpt: 'cesar' });
      break;
    default:
      const city = req.params.city
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      const dpt = city_dpt.get(city);
      res.json({ city: city, dpt: dpt });
      break;
  }
});

try {
  app.listen(port);
  console.log('server running on port ' + port);
} catch (error) {
  console.log(error);
}
