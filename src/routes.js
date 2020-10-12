import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Main from './pages/Main';
import Repository from './pages/Repository';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        {/* Switch assegura que só um rota é requerida por vez.
        exact equivale === */}
        <Route path="/" exact component={Main} />
        <Route path="/repository/:repository" component={Repository} />
        {/* /:repository, comunica a rota que pode vir uma / acompanhada
            de um parametro.
        */}
      </Switch>
    </BrowserRouter>
  );
}
