import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import session from "express-session";
import { buildContext, GraphQLLocalStrategy } from "graphql-passport";
import http from "http";
import mongoose from "mongoose";
import passport from "passport";
import uuid from "uuid/v4";

import config from "./config";
import User from "./models/user";
import { schema } from "./schema";

const PORT = 4000;
const SECRET_KEY = "secret";

mongoose.Promise = global.Promise;

mongoose.connect(
  config.mongodb.uri,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  }
);

mongoose.connection.once(
  "open",
  () => console.log(`Connected to MongoDB at ${config.mongodb.uri}`)
);

// TODO use findById
passport.use(
  new GraphQLLocalStrategy(async (username, password, done) => {
    const matchingUser = await User.findOne({
      username,
      password
    });
    const error = matchingUser ? null : new Error("no matching user");
    done(error, matchingUser);
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(session({
  genid: () => uuid(),
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  // use secure cookies for production meaning they will only be sent via https
  // cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  schema, 
  context: ({ req, res }) => buildContext({ req, res, User }),
  playground: {
    settings: {
      "request.credentials": "same-origin",
    },
  },
});

server.applyMiddleware({ app, cors: false });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: PORT }, () => {
  console.log(
    `🚀🚀🚀 Server ready at http://localhost:${PORT}`,
  );
});