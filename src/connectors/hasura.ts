
import axios from "axios";

export async function hasuraAdminQuery (query: string, variables: Record<string, any> = {}) {
    try {
        const { data } = await axios.post(
            process.env.HASURA_GRAPHQL_ENDPOINT as string,
            {
                query,
                variables,
            },
            {
                headers: {
                    'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
                },
            },
        )

        return data
    } catch (e) {
        return { errors: [{ message: e }] }
    }
}

export async function hasuraClientQuery(authHeader:string, query: string, variables: Record<string, any> = {}) {
    try {
        const { data } = await axios.post(
            process.env.HASURA_GRAPHQL_ENDPOINT as string,
            {
                query,
                variables,
            },
            {
                headers: {
                    Authorization: authHeader,
                },
            },
        )

        return data
    } catch (e) {
        return { errors: [{ message: e }] }
    }
}