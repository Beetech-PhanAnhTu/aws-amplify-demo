import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

// Thay thế với URL endpoint của API GraphQL của bạn
const GRAPHQL_ENDPOINT = 'https://zvfzissuvjcwdn4fdgr6cdbiiy.appsync-api.ap-northeast-1.amazonaws.com/graphql';

const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT, // Sử dụng authLink nếu bạn cần xác thực
  headers: {
    "X-Api-Key": "da2-ktxfmymn5jg2ha6d6z3ywav4q4"
  },
  cache: new InMemoryCache(),
});

export default client;