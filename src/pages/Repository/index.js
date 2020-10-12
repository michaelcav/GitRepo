import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import { Loading, Owner, IssueList } from './styles';
import Container from '../../components/Container';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
  };

  async componentDidMount() {
    // match é uma destruturação de props
    // dentro de match existem a prop params, que armazena os parametros.
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);
    // func para fazer o async de 2 ou mais ao mesmo tempo
    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
          // condições de quais issues vc quer receber
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  render() {
    const { repository, issues, loading } = this.state;
    // loading, condição para só retornar o conteudo após todas as requi estiverem concluidas.
    if (loading) {
      return <Loading>Loading...</Loading>;
    }

    return <Container>
      {/* Owner infos do dono repositorio */}
      <Owner>
        <Link to="/">Return to repositories</Link>
        <img src={repository.owner.avatar_url} alt={repository.owner.login}/>
        <h1>
          {repository.name}
        </h1>
        <p>
          {repository.description}
        </p>
      </Owner>

      <IssueList>
      {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a
                    href={issue.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {issue.title}
                  </a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
      </IssueList>
    </Container>;
  }
}
