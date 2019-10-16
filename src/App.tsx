import { ApolloProvider } from "@apollo/react-hooks";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import apolloClient from "./apollo/client";
import { useCurrentUserQuery } from "./hooks/hooks";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import NoMatch from "./pages/NoMatch";
import Signup from "./pages/Signup";
import { StoreProvider, useStore } from "./stores/store";

const AppRoutes = () => {
  const { data, loading } = useCurrentUserQuery();
  const { setUserId } = useStore();

  if (loading) {
    return <p>Loading...</p>;
  }

  const currentUser = data && data.currentUser;

  if (!currentUser) {
    setUserId(null);
    return (
      <>
        <Route exact path="/">
          <Login />
        </Route>
        <Route path="/register">
          <Signup />
        </Route>
      </>
    );
  }

  setUserId(currentUser.id);

  return (
    <Route exact path="/">
      <Chat />
    </Route>
  );
};

const App = () => {
  return (
    <StoreProvider>
      <ApolloProvider client={apolloClient}>
        <Router>
          <Switch>
            <AppRoutes />
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        </Router>
      </ApolloProvider>
    </StoreProvider>
  );
};

export default App;
