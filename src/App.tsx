import { ApolloProvider } from "@apollo/react-hooks";
import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import apolloClient from "./apollo/client";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import NoMatch from "./pages/NoMatch";
import { fakeAuth } from "./services/fakeAuth";

const PrivateRoute = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        fakeAuth.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

const App = () => (
  <ApolloProvider client={apolloClient}>
    <Router>
      <Switch>
        <PrivateRoute exact path="/">
          <Chat />
        </PrivateRoute>
        <PrivateRoute path="/chat/:chatId">
          <Chat />
        </PrivateRoute>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </Router>
  </ApolloProvider>
);

export default App;
