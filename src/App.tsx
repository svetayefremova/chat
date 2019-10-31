import { ApolloProvider } from "@apollo/react-hooks";
import { css, Global } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";
import normalize from "normalize.css";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import apolloClient from "./apollo/client";
import { useCurrentUserQuery } from "./hooks/hooks";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import NoMatch from "./pages/NoMatch";
import Signup from "./pages/Signup";
import { StoreProvider, useStore } from "./stores/store";
import { theme } from "./theme";

const AppRoutes = () => {
  const { data, loading } = useCurrentUserQuery();
  const { userId, setUserId, setCurrentChatId } = useStore();

  if (loading) {
    return <p>Loading...</p>;
  }

  const currentUser = data && data.currentUser;

  if (!currentUser) {
    // TODO create clear action in store for all items and move to logout
    setUserId(null);
    setCurrentChatId(null);
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

  if (!userId) {
    setUserId(currentUser.id);
  }

  return (
    <Route exact path="/">
      <Chat />
    </Route>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Global
        styles={css`
          ${normalize}
          body {
            background-color: ${theme.colors.background};
            overflow: hidden;
          }
          p {
            margin: 0;
          }
          ul {
            list-style-type: none;
            padding: 0;
          }
        `}
      />
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
    </ThemeProvider>
  );
};

export default App;
