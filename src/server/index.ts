#!/usr/bin/env node
/* eslint-disable no-console */
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { SERVER_DEFAULT_PORT, SERVER_URI } from '../client/Constants';
import { save } from './saver';

var args = process.argv.slice(2);

let port = SERVER_DEFAULT_PORT;
if (args.length >= 2 && args[0] === '-p') {
  port = parseInt(args[1]);
};

if (isNaN(port)) {
  console.error('Port should be a number');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post(`/${SERVER_URI}`, (req: express.Request, res: express.Response) => {
  const { fileName, code, testsFolder } = req.body;

  return save(fileName, code, testsFolder)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((e: any) => {
      console.error(
        'During saving next error occured: ',
        e,
        ' \n Return 500 with error description'
      );
      res.status(500).send({ error: e.message });
    });
});

app.listen(port, () => console.log(`Flashtest server listening on port ${port}!`));
