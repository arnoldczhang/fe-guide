const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
} = require('graphql');

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world';
        }
      },
      aa: {
        type: GraphQLBoolean,
        resolve() {
          return 'aaaa';
        },
      }
    }
  })
});

var query = '{ hello }';

graphql(schema, query).then(result => {
  console.log(result);
});
