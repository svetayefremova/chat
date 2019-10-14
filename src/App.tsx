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
import SignIn from "./pages/SignIn";
import { StoreProvider, useStore } from "./stores/store";

const PrivateRoute = ({ children, ...rest }) => {
  const { userId } = useStore();
  console.log(userId);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        userId ? (
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
  <StoreProvider>
    <ApolloProvider client={apolloClient}>
      <Router>
        <Switch>
          <PrivateRoute exact path="/">
            <Chat />
          </PrivateRoute>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <SignIn />
          </Route>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>
  </StoreProvider>
);

export default App;
