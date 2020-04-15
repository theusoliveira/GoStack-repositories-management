import React, { useState, useEffect } from "react";
import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories')
      .then(res => setRepositories(res.data));
  }, [])

  async function handleAddRepository() {
    const res = await api.post('repositories', ({
      title: `Novo repositório ${Date.now()}`
    }));

    const repository = res.data;

    setRepositories([...repositories, repository]);
  }

  async function handleRemoveRepository(id) {
    const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
    repositories.splice(repositorieIndex, 1);
    await api.delete(`repositories/${id}`)
      .then(() => setRepositories([...repositories]))
      .catch(err => {
        alert(err.response.data.error);
      });
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(item => 
          <li key={item.id}>
            {item.title}
            <button onClick={() => handleRemoveRepository(item.id)}>
              Remover
            </button>
          </li>
        )}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
