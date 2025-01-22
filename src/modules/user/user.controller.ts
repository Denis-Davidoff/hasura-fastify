// main logic of each route

import {FastifyReply, FastifyRequest} from 'fastify'
import {CreateUser, LoginUser} from '@/modules/user/user.schema'
import bcrypt from 'bcrypt'
import {hasuraAdminQuery} from "@/connectors/hasura";
import * as console from "node:console";

const SALT_ROUNDS = 10

export async function createAuthor(
    req: FastifyRequest<{
        Body: CreateUser
    }>,
    reply: FastifyReply,
) {
    const {password, email} = req.body

    let response = await hasuraAdminQuery(`
        mutation($email: String!, $password: String!) {
            insert_nodeart_authors(objects: {email: $email, password: $password}) {
                returning {
                    uid
                    email
                    is_admin
                }
            }
        }
    `, {
        email,
        password: await bcrypt.hash(password, SALT_ROUNDS),
    });

    if (!response.errors) {
        let userInfo = response.data.insert_nodeart_authors.returning[0];

        return reply.code(200).send(userInfo);
    }

    return reply.code(500).send(response.errors);
}

export async function login(
    req: FastifyRequest<{
        Body: LoginUser
    }>,
    reply: FastifyReply,
) {
    const {email, password} = req.body

    console.log('LOGIN', email, password);

    let response = await hasuraAdminQuery(`
        query getUserByEmail($email: String!) {
            nodeart_authors(where: { email: { _eq: $email } }) {
                uid
                is_admin
                password
            }
        }
    `, {
        email
    });

    console.log(response, email);

    if (!response.errors) {
        let user = response.data.nodeart_authors[0];

        console.log('USER', user);

        const isMatch = user && await bcrypt.compare(password, user.password)

        if (!user || !isMatch) {
            return reply.code(401).send({
                message: 'Invalid email or password',
            })
        }

        let allowedRoles = ['public', 'author'];
        if (user.is_admin) {
            allowedRoles.push('admin');
        }

        const payload = {
            "https://hasura.io/jwt/claims": {
                "x-hasura-allowed-roles": allowedRoles,
                "x-hasura-default-role": 'author',
                "X-Hasura-User-Id": user.uid,
                //otherClaims: {},
            },
        };

        const token = req.jwt.sign(payload, {
            expiresIn: '10h',
            key: process.env.HASURA_GRAPHQL_JWT_SECRET_KEY as string,
        })

        reply.setCookie('access_token', token, {
            path: '/',
            httpOnly: true,
            secure: true,
        })

        return {accessToken: token}
    }

    return reply.code(500).send(response.errors);
}