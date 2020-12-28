// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Product, Note } = initSchema(schema);

export {
  Product,
  Note
};