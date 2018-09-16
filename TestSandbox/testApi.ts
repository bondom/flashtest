import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/toUpperCase/:delay/:arg', (req: express.Request, res: express.Response) => {
  const { delay, arg } = req.params;
  const result = arg ? arg.toUpperCase() : '';
  setTimeout(() => {
    res.send(result);
  }, delay);
});

app.get('/base64/:delay/:arg', (req: express.Request, res: express.Response) => {
  const { delay, arg } = req.params;
  const result = arg ? Buffer.from(arg, 'base64') : '';
  setTimeout(() => {
    res.send(result);
  }, delay);
});

app.get('/base64encode/:delay/:arg', (req: express.Request, res: express.Response) => {
  const { delay, arg } = req.params;
  const result = arg ? new Buffer(arg).toString('base64') : '';
  setTimeout(() => {
    res.send(result);
  }, delay);
});

app.post('/status/:delay/:statusCode', (req: express.Request, res: express.Response) => {
  const { delay, statusCode } = req.params;
  setTimeout(() => {
    res.sendStatus(statusCode);
  }, delay);
});

const todoListRequestsDelay = 100;
const initialTodoList = [
  {
    id: 1,
    text: 'drink water'
  },
  {
    id: 2,
    text: 'buy banana'
  }
];

let todoList: Array<{
  id: number;
  text: string;
}> = JSON.parse(JSON.stringify(initialTodoList));

// todo list
app.get('/todolist', (req: express.Request, res: express.Response) => {
  setTimeout(() => {
    res.json(todoList);
  }, todoListRequestsDelay);
});

app.delete('/todolist/:id', (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  setTimeout(() => {
    todoList = todoList.filter(item => item.id != id);
    res.sendStatus(200);
  }, todoListRequestsDelay);
});

app.post('/todolist/:text', (req: express.Request, res: express.Response) => {
  const { text } = req.params;
  setTimeout(() => {
    const newId =
      todoList.length === 0 ? 1 : Math.max.apply(null, todoList.map(item => item.id)) + 1;
    todoList.push({
      id: newId,
      text
    });
    res.sendStatus(200);
  }, todoListRequestsDelay);
});

app.post('/todolist-reset', (req: express.Request, res: express.Response) => {
  setTimeout(() => {
    todoList = JSON.parse(JSON.stringify(initialTodoList));
    res.sendStatus(200);
  }, todoListRequestsDelay);
});

app.disable('etag');

/* eslint-disable no-console */
app.listen(3002, () => console.log('Test api listening on port 3002!'));
