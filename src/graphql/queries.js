/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getLead = /* GraphQL */ `
  query GetLead($id: ID!) {
    getLead(id: $id) {
      id
      name
      email
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listLeads = /* GraphQL */ `
  query ListLeads(
    $filter: ModelLeadFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLeads(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
