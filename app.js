const express = require('express');
const bodyParser = require('body-parser');

const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQLSchema = require('./graphql/schema/index.js');
const graphQLResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middileware/is-auth');

// graphqlHttp here happened to be a function that can we used in a place where express expects a middileware function

const app = express();

const PORT = process.env.PORT || 8000;
app.use(bodyParser.json());

// to remove cors error.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(isAuth);
// single endpoint of graphql
// property  : type(in right side of colon) of property
app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true,
  })
);

app.use(express.static('frontend/build'));

mongoose
  .connect(
    `mongodb+srv://harshwalia:Hwalia123@cluster0-zvhey.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}.`);
    });
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.log(err);
  });
