const express=require('express')
const bodyParser=require('body-parser')
require('dotenv').config()
const app=express()
const { graphqlHTTP } = require('express-graphql');
const { buildSchema}=require('graphql')


app.use(bodyParser.json())

let events=[]

app.use('/graphql', graphqlHTTP({// This line defines an endpoint /graphql for your Express.js application where the GraphQL API will be exposed. graphqlHttp is the middleware function that enables the /graphql route to handle GraphQL queries and mutations.

    //first define the schemas

    //This defines the GraphQL schema using buildSchema from graphql. The schema is written in GraphQL's Schema Definition Language (SDL) format.

    // events: [String!]!: This specifies that the events field will return a list of non-nullable strings (String!). The ! indicates that each string in the list cannot be null, and the list itself cannot be null either.

    // createEvent(name: String): String!: This specifies that the createEvent field will accept a non-nullable string (String!) as an argument and return a non-nullable string (String!).
    //schema { query: Query, mutation: Mutation }: This is the root schema declaration that links the query and mutation types to the GraphQL schema. It tells GraphQL that the Query type should be used for queries, and Mutation type for mutations.

    //rootValue: {...}: This is the object that contains the resolver functions for handling queries and mutations. Resolvers are the actual functions that get called to fetch or manipulate data when a query or mutation is executed.
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
    
        input EventInput {
            title: String!
            description: String!
            price: Float!
        }
    
        type Query {
            events: [Event!]!
        }
    
        type Mutation {
            createEvent(eventInput: EventInput!): Event
        }
    
        schema {
            query: Query
            mutation: Mutation
        }
    `),
    
        //the exclamations mean nunnability ie are mandatory       


        //second define the resolvers
        //the resolvers go to the rootValue
        //they must have same name as the schemas
    rootValue:{
        events:()=>{
            return events //events resolver
        },
        createEvent: (args)=>{ //createEvent resolver
            const event={
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date().toISOString()
            }
            events.push(event)
            return event //return the new event
        }
    },
    graphiql:true
    // This is an option provided by express-graphql for enabling the GraphiQL interface, an in-browser tool to visualize and interact with your GraphQL API.

    //GraphiQL is an in-browser IDE (Integrated Development Environment) for GraphQL, allowing you to interact with your GraphQL API. It lets you run queries, mutations, and subscriptions, view schema documentation, and see real-time responses from your API.

    //Once your server is running and GraphiQL is enabled, you can visit http://localhost:4000/graphql (assuming you're running the server locally on port 4000).
    // You’ll see the GraphiQL interface where you can:
    // Write queries and mutations.
    // Browse your GraphQL schema in the Documentation Explorer on the right-hand side.
    // See real-time results and response times of your queries.
})
);

port=process.env.PORT
app.listen(port)