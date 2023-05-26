import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import csv from 'csv-parser';

const app = express();
const port = process.env.PORT || 3000;

//app.use(express.json());

const output = [];
const city_dpt = new Map();

fs.createReadStream('./src/data/DATOSFINAL.csv')
  .pipe(csv())
  .on('data', (data) => output.push(data))
  .on('end', () => {
    output.forEach((row) => {
      city_dpt.set(
        row['MUNICIPIO'],
        row['DEPARTAMENTO']
        /*.normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()*/
      );
    });
  });

app.use(cors());
app.use(morgan('dev'));

app.get('/:city', (req, res) => {
  switch (req.params.city) {
    case 'Bogota':
      res.send('Cundinamarca');
      break;
    case 'Medellin':
      res.send('Antioquia');
      break;
    case 'Cali':
      res.send('Valle del cauca');
      break;
    case 'Barranquilla':
      res.send('Atlantico');
      break;
    case 'Cartagena':
      res.send('Bolivar');
      break;
    case 'Bucaramanga':
      res.send('Santander');
      break;
    case 'Santa marta':
      res.send('Magdalena');
      break;
    case 'Valledupar':
      res.send('Cesar');
      break;
    case 'San Andres':
      res.send('San Andres y Providencia');
      break;
    default:
      const dpt = city_dpt.get(req.params.city);
      res.send(dpt);
      break;
  }
});

try {
  app.listen(port);
  console.log('server running on port ' + port);
} catch (error) {
  console.log(error);
}
