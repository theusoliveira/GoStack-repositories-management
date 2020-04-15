const express = require('express');
const cors = require('cors');
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.filter(item => item.title.includes(title))
    : repositories;

  return response.status(200).json(results);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs = [] } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs = [] } = request.body;

  const repositoryIndex = repositories.findIndex(item => item.id === id);
  const repository = repositories.find(item => item.id === id);

  if (!repository) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const repositoryUpdated = {
    id,
    title,
    url,
    techs,
    likes: repository.likes,
  };

  repositories[repositoryIndex] = repositoryUpdated;

  return response.status(200).json(repositoryUpdated);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(item => item.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(item => item.id === id);
  const repository = repositories.find(item => item.id === id);

  if (!repository) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const repositoryLiked = {
    ...repository,
    likes: repository.likes + 1,
  };

  repositories[repositoryIndex] = repositoryLiked;

  return response.status(200).json(repositoryLiked);
});

module.exports = app;
