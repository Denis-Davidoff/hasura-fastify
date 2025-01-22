// handle user routes

import { createUserSchema, createUserResponseSchema, loginUserSchema, loginResponseSchema } from './user.schema'

import { FastifyInstance } from 'fastify'

import {createAuthor, login} from './user.controller'

// /api/users
export async function userRoutes(app: FastifyInstance) {

    app.get('/', () => 'Users' )

    app.post(
        '/register',
        {
            schema: {
                body: createUserSchema,
                response: {
                    201: createUserResponseSchema,
                },
            },
        },
        createAuthor
    )

    app.post(
        '/login',
        {
            schema: {
                body: loginUserSchema,
                response: {
                    201: loginResponseSchema,
                },
            },
        },
        login,
    )

    app.log.info('User routes registered')
}