import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import csv from 'csv-parser';

const app = express();
const port = process.env.PORT || 3000;

const output = [];
const city_dpt = new Map();

fs.createReadStream('./src/data/Departamentos_y_municipios_de_Colombia.csv')
  .pipe(csv())
  .on('data', (data) => output.push(data))
  .on('end', () => {
    output.forEach((row) => {
      city_dpt.set(
        row['MUNICIPIO'].replace(/[\u0300-\u036f]/g, ''),
        row['DEPARTAMENTO'].replace(/[\u0300-\u036f]/g, '')
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
    case 'Santa Marta':
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
      res.send(String(dpt));
      break;
  }
});

try {
  app.listen(port);
  console.log('server running on port ' + port);
} catch (error) {
  console.log(error);
}
