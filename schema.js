//GraphQL schema for API
const { gql } = require('apollo-server-express');
const GraphQLJSON = require('graphql-type-json');

module.exports ={
    // define schema using SDL
    typeDefs: gql`
        scalar JSON
        
        type Asset {
            id: ID!
            primaryCategory: String!
            wealthType: String!
            assetInfo: JSON!
            balanceCurrent: Float!
            balanceAsOf: String!
        }
        type Query {
        assets(asOf: String): [Asset!]!
        }
        `,
    resolvers: {
        JSON: GraphQLJSON
    }

};