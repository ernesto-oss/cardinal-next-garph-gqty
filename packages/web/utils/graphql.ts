import React from 'react';
import { cookies } from 'next/headers';
import { createClient, createGeneratedSchema, createScalarsEnumsHash, schema, type QueryFetcher } from '@acme/api'

export const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://127.0.0.1:${process.env.PORT ?? 3000}`;
};

// export function registerClient(makeClient: () => Client) {
//   const getClient = React.cache(makeClient);
//   return {
//     getClient,
//   };
// }

// export function getDefaultGraphqlHeaders(
//   operation: GraphqlOperation | GraphqlOperation[],
// ) {
//   const options = {
//     method: 'POST',
//     body: JSON.stringify(operation),
//     headers: {
//       Accept: 'application/json',
//       'content-type': 'application/json',
//       'content-length': Buffer.byteLength(JSON.stringify(operation)).toString(),
//     },
//   } as RequestInit;
//   return options;
// }

function createQueryFetcher (fetchOptions?: RequestInit): QueryFetcher {
  return async function (
    { query, variables, operationName }
  ) {
    const response = await fetch(`${getBaseUrl()}/api/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
        operationName,
      }),
      mode: "cors",
      ...fetchOptions,
    })

    return await response.json()
  }
}

export const client = createClient({
  fetcher: createQueryFetcher(),
  generatedSchema: createGeneratedSchema(schema),
  scalarsEnumsHash: createScalarsEnumsHash(schema)
});
