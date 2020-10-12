import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';
import { Link } from 'react-router-dom';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
  };

  componentDidMount() {
    // carregar os dados do LocaoStorage
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      // se forem encontrados repositories:
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }
  // pega as atualizacoções que acontecem no estado
  // _  <-- representa as propriedades, atts n acontecem nas propriedades
  // se n for usar as propriedades use _
  componentDidUpdate(_, prevState) {
    // salvar os dados do localStorage
    const { repositories } = this.state;
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  /* funcs para o Form do app */
  handleInputChange = (e) => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault(); /* evita o refrash no form */
    this.setState({ loading: true });

    const { newRepo, repositories } = this.state;
    const response = await api.get(`/repos/${newRepo}`);
    const data = {
      name: response.data.full_name,
    };
    this.setState({
      repositories: [...repositories, data],
      /* toda vez que o user adicionar um
      repositório, um novo vetor é criado
      baseado no vetor que já existe de repositórios
       */
      newRepo: '' /* limpa o input após um serach */,
      loading: false,
    });
  };

  render() {
    const { newRepo, repositories, loading } = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositories
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="add repositories"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading ? 1 : 0}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map((repository) => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              {/* no link tem um js que não só leva na pag repo, mas
              tbm encaminha para o nome do repositorio no git

              encode, serve para substituit a / na url do navegador
              em um caractere especial

              decode, serve para reverter o encode
              */}
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Details
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
