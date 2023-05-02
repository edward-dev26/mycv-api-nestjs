import { DataSource } from 'typeorm';

import dbConfig from './db.config';

const source = new DataSource(dbConfig);

source
  .initialize()
  .then(() => console.log('Data Source has been initialized'))
  .catch((error) => console.error('Error initializing Data Source', error));

export default source;
