import express from 'express';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'recommendation service' });
});

app.listen(port, host, async () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
