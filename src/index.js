const { ApolloServer } = require('apollo-server')
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

let links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQl',
  },
]

// 2
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,

    feed: () => links,
    link: (parent, args) => {
      const data = links.find((link) => link.id === args.id)
      return data
    },
  },
  Mutation: {
    post: (parent, args) => {
      let idCount = links.length

      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    },
  },
}

const prisma = new PrismaClient()

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
  context: {
    prisma,
  },
})

server.listen().then(({ url }) => console.log(`Server is running on ${url}`))
