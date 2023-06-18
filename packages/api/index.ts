import { createYoga } from "graphql-yoga";
import { g, buildSchema, InferResolvers } from "garph";
import { InferClient } from "garph/dist/client";
import {
  createGeneratedSchema,
  createScalarsEnumsHash,
} from "@garph/gqty/dist/utils";
import {
  createClient as createGQtyClient,
  Cache,
  QueryFetcher,
  ScalarsEnumsHash,
  Schema,
  SubscriptionClient,
  CacheOptions,
} from "gqty";

const queryType = g.type("Query", {
  greetings: g.string().description("Greets a person"),
});

const resolvers: InferResolvers<{ Query: typeof queryType }, {}> = {
  Query: {
    greetings: () => `Greetings from GraphQL`,
  },
};

type SchemaTypes = InferClient<{ query: typeof queryType }>;

type ClientOptions = {
  generatedSchema: Schema;
  scalarsEnumsHash: ScalarsEnumsHash;
  fetcher: QueryFetcher;
  fetchOptions?: RequestInit;
  subscriptionClient?: SubscriptionClient;
  cacheOptions?: CacheOptions;
};

export const schema = buildSchema({ g, resolvers });

export function createClient<T extends SchemaTypes>(options: ClientOptions) {
  type Query = T['query'];
  type GeneratedSchema = { query: Query }

  const cache = new Cache(
    undefined,
    /**
     * Default cache options immediate expiry with a 5 minutes window of
     * stale-while-revalidate.
     */
    {
      maxAge: 0,
      staleWhileRevalidate: 5 * 60 * 1000,
      normalization: true,
      ...options.cacheOptions
    }
  )

  const client = createGQtyClient<GeneratedSchema>({
    scalars: options.scalarsEnumsHash,
    schema: options.generatedSchema,
    cache,
    fetchOptions: {
      fetcher: options.fetcher,
    }
  })

  return client;
} 

const { handleRequest } = createYoga({
  fetchAPI: { Response },
  schema: schema,
  graphqlEndpoint: "/api/graphql",
});

export { handleRequest, createGeneratedSchema, createScalarsEnumsHash };
export type { ClientOptions, QueryFetcher }
