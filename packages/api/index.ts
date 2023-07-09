import { headers } from "next/headers";
import { auth, Session } from "@acme/auth";
import { YogaInitialContext, createYoga } from "graphql-yoga";
import { g, buildSchema, InferResolvers } from "garph";
import { InferClient } from "garph/dist/client";
import { createGeneratedSchema, createScalarsEnumsHash } from "./utils";
import { createClient, type QueryFetcher } from "./client";

type Context = YogaInitialContext & {
  session: Session;
};

const queryType = g.type("Query", {
  greetings: g.string().description("Greets a person"),
  authorizedOnly: g
    .string()
    .optional()
    .description("Sends a message only to authorized users"),
});

const resolvers: InferResolvers<
  { Query: typeof queryType },
  { context: Context }
> = {
  Query: {
    greetings: () => {
      return `Greetings from GraphQL`;
    },
    authorizedOnly: (_parent, _args, context) => {
      if (context.session) {
        return "Greetings from protected query";
      } else {
        return null;
      }
    },
  },
};

export type SchemaTypes = InferClient<{ query: typeof queryType }>;

export const schema = buildSchema({ g, resolvers });

const { handleRequest } = createYoga({
  fetchAPI: { Response },
  schema: schema,
  graphqlEndpoint: "/api/graphql",
  context: async () => {
    const authorizationHeader = headers().get("authorization");
    const sessionToken = authorizationHeader?.split(" ").pop();
    if (sessionToken) {
      const session = await auth.validateSessionUser(sessionToken);
      return { session };
    }
  },
});

export {
  handleRequest,
  createGeneratedSchema,
  createScalarsEnumsHash,
  createClient,
};
export type { QueryFetcher };
