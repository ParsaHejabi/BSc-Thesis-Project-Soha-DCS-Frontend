import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from 'apollo-link-context'

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken')
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const httpLink = createHttpLink({
  uri:
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000/'
      : 'https://soha-dcs.herokuapp.com/',
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

export default client
