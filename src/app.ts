import 'dotenv/config'
import '@/types/fastify'
import Fastify, {FastifyRequest, FastifyReply} from 'fastify'
import fJWT, { FastifyJWT } from '@fastify/jwt'
import multipart from '@fastify/multipart'
import fCookie from '@fastify/cookie'
import { userRoutes } from '@/modules/user/user.route'
import { uploadRoutes } from '@/modules/upload/upload.route'

const app = Fastify({ logger: true }) // you can disable logging

// jwt
app.register(
    fJWT,
    {
        secret: process.env.HASURA_GRAPHQL_JWT_SECRET_KEY as string,
        sign: { algorithm: process.env.HASURA_GRAPHQL_JWT_SECRET_TYPE as 'HS256' }, // ts type check fix
    },
)

app.addHook('preHandler', (req, res, next) => {
    req.jwt = app.jwt
    return next()
})

app.decorate(
    'authenticate',
    async (req: FastifyRequest, reply: FastifyReply) => {
        let token = '';

        if (req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            return reply.status(401).send({ message: 'Authentication required' })
        }

        const decoded = app.jwt.verify<FastifyJWT['user']>(token)

        app.log.info('USER_ID : ' + decoded.id)

        req.user = decoded
    },
)

// cookies
app.register(fCookie, {
    secret: process.env.HASURA_GRAPHQL_ADMIN_SECRET as string,
    hook: 'preHandler',
})

app.register(multipart)

app.register(userRoutes, { prefix: 'api/user' })

app.register(uploadRoutes, { prefix: 'api/upload' })

app.get('/healthcheck', (req, res) => {
    res.send({ message: 'Success' })
})

const listeners = ['SIGINT', 'SIGTERM']
listeners.forEach((signal) => {
    process.on(signal, async () => {
        await app.close()
        process.exit(0)
    })
})

async function main() {
    await app.listen({
        port: 8000,
        host: '0.0.0.0',
    })
}

main()