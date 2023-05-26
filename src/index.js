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

app.get('/city/:city', (req, res) => {
  switch (req.params.city) {
    case 'bogota':
      res.send('cundinamarca');
      break;
    case 'medellin':
      res.send('antioquia');
      break;
    case 'cali':
      res.send('valle del cauca');
      break;
    case 'barranquilla':
      res.send('atlantico');
      break;
    case 'cartagena':
      res.send('bolivar');
      break;
    case 'bucaramanga':
      res.send('santander');
      break;
    case 'santa marta':
      res.send('magdalena');
      break;
    case 'valledupar':
      res.send('cesar');
      break;
    default:
      const dpt = city_dpt.get(city);
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
