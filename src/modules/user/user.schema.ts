// handling input and response schemas

import {z} from 'zod'
import {zodToJsonSchema} from "zod-to-json-schema";

// data that we need from user to register
export const createUserInput = z.object({
    email: z.string(),
    password: z.string().min(6),
})

//exporting the type to provide to the request Body
export type CreateUser = z.infer<typeof createUserInput>

export const createUserSchema = zodToJsonSchema(createUserInput);


// response schema for registering user
export const createUserResponseInput = z.object({
    id: z.string(),
    email: z.string(),
})

export const createUserResponseSchema = zodToJsonSchema(createUserResponseInput);


// same for login route
export const loginUserInput = z.object({
    email: z
        .string({
            required_error: 'Email is required',
            invalid_type_error: 'Email must be a string',
        })
        .email(),
    password: z.string().min(6),
})

export type LoginUser = z.infer<typeof loginUserInput>

export const loginUserSchema = zodToJsonSchema(loginUserInput);


export const loginResponseInput = z.object({
    accessToken: z.string(),
})

export const loginResponseSchema = zodToJsonSchema(loginResponseInput);

export const userSchemas = [
    createUserSchema,
    createUserResponseSchema,
    loginUserSchema,
    loginResponseSchema
] as const;
