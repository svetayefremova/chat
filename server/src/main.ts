import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";

import config from "./config";
import { schema } from "./schema";

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

const server = new ApolloServer({ schema });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});