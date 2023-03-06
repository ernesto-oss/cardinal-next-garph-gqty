import { g, InferResolvers, buildSchema } from "garph";
import { InferClient, createClient } from "@garph/gqty";

const queryType = g.type("Query", {
  greet: g.string().description("Greets a person"),
});

const resolvers: InferResolvers<{ Query: typeof queryType }, {}> = {
  Query: {
    greet: () => `Hello from GraphQL`,
  },
};

type ClientTypes = InferClient<{ query: typeof queryType }>;

export const schema = buildSchema({ g, resolvers });
export const { useQuery } = createClient<ClientTypes>({
  schema: g,
  url: "http://localhost:3000/api/graphql",
});
