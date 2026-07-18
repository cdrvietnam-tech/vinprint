import { startProdServer } from 'vinext/server/prod-server';
import path from 'path';

const port = process.env.PORT || 3000;
const host = '0.0.0.0';

console.log(`Starting vinext production server on port ${port}...`);

startProdServer({
  port: Number(port),
  host,
  outDir: path.resolve(process.cwd(), 'dist')
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
