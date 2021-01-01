import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from 'apollo-link-context'

let uri

// if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
//   uri = 'http://localhost:5000/'
// } else {
//   uri = 'https://soha-dcs-backend.herokuapp.com/'
// }

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken')
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const httpLink = createHttpLink({
  uri: 'http://nlplab.sbu.ac.ir:50108/',
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

export default client
