import { JWT } from '@fastify/jwt'

declare module 'fastify' {
    interface FastifyRequest {
        jwt: JWT & { sign: any }
    }
    export interface FastifyInstance {
        authenticate: any
    }

    export interface fastify {
        authenticate: any
    }
}


declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: any
    }
}