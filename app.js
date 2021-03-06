const express = require("express");
const { graphqlHTTP } = require("express-graphql"); // exports 1 thing.
const { buildSchema } = require("graphql");

const app = express();
app.use(express.json());

const events = [];

app.use(
    '/graphql',
    graphqlHTTP({
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
            date: String!
          }

          type RootQuery {
              events: [Event!]!
          }
          type RootMutation {
              createEvent(eventInput: EventInput): Event
          }
          schema {
              query: RootQuery
              mutation: RootMutation
          }
      `),
      rootValue: {
        events: () => {
          return events;
        },
        createEvent: ({ eventInput }) => {
          const event = {
              _id: Math.random().toString(),
              title: eventInput.title,
              description: eventInput.description,
              price: +eventInput.price,
              date: eventInput.date
          }

          events.push(event);
          return event;
        }
      },
      graphiql: true
    })
  );
  
  app.listen(3000, () => console.log("Running on 3000"));