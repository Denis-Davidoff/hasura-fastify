// handling input and response schemas

import {z} from 'zod'
import {zodToJsonSchema} from "zod-to-json-schema";

// data that we need from user to register
export const fileUploadInput = z.object({
    action: z.object({
        name: z.string().optional()
    }),
    input: z.object({
        userId: z.string().optional(),
        base64: z.string().optional()
    }),
    request_query: z.string().optional(),
    session_variables: z.object({}).optional(),
})

//exporting the type to provide to the request Body
export type FileUploadInput = z.infer<typeof fileUploadInput>

export const fileUploadInputSchema = zodToJsonSchema(fileUploadInput);


// response schema for registering user
export const fileUploadResponse = z.object({
    url: z.string(),
    mimetype: z.string(),
    size: z.number(),
})

export const fileUploadResponseSchema = zodToJsonSchema(fileUploadResponse);