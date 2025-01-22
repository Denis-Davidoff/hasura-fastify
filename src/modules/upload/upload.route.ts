// handle user routes

import { fileUploadInputSchema } from './upload.schema'

import { FastifyInstance } from 'fastify'

import {uploadAction, uploadImgur} from './upload.controller'

import '@/types/fastify'

// /api/upload
export async function uploadRoutes(app: FastifyInstance) {

    app.post(
        '/',
        {
            onRequest: [app.authenticate]
        },
        uploadAction,
    )

    app.post(
        '/imgur',
        {
            schema: {
                body: fileUploadInputSchema,
                // response: {
                //     201: fileUploadResponseSchema,
                // },
            },
        },
        uploadImgur,
    )

    app.log.info('Upload routes registered')
}