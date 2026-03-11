import express from 'express';
import { createExpressMiddleware } from 'agendash';
import { Agenda } from 'agenda';
import { MongoBackend } from '@agendajs/mongo-backend';

const app = express();


const agenda = new Agenda({
    backend: new MongoBackend({ address: 'mongodb://localhost:27017', options: { auth: { username: 'root', password: 'example'}}})
});

// Define a job
agenda.define('send email', async (job) => {
  const { to, subject } = job.attrs.data;
  await sendEmail(to, subject);
});

// Start processing
await agenda.start();

// Schedule jobs
await agenda.every('1 hour', 'send email', { to: 'user@example.com', subject: 'Hello' });
await agenda.schedule('in 5 minutes', 'send email', { to: 'admin@example.com', subject: 'Report' });
await agenda.now('send email', { to: 'support@example.com', subject: 'Urgent' });



// Mount agendash at /dash
app.use('/dash', createExpressMiddleware(agenda));

app.listen(3000, () => {
  console.log('Dashboard: http://localhost:3000/dash');
});