
import {FastifyReply, FastifyRequest} from 'fastify'
import {FileUploadInput} from '@/modules/upload/upload.schema'
import {hasuraAdminQuery} from "@/connectors/hasura";
import axios from "axios";


// convert uploaded file to base64 and move to hasura
export async function uploadAction(
    req: FastifyRequest,
    reply: FastifyReply,
) {
    const data = await req.file()

    if (data?.mimetype !== 'image/jpeg' && data?.mimetype !== 'image/png') {
        return reply.code(400).send('Unsupported file type');
    }

    const fileBuffer = await data.toBuffer();
    const base64String = fileBuffer.toString('base64');

    // possible to make additional role check here
    const userId = req.user['https://hasura.io/jwt/claims']['X-Hasura-User-Id'];

    let response = await hasuraAdminQuery(
        `
        mutation($base64: String!, $userId: String!) {
            fileUpload(base64: $base64, userId: $userId) {
              url
              mimetype
              size
            }
        }
    `, {
        base64: base64String,
        userId: userId
    });

    if (!response.errors) {
        let fileInfo = response.data.upload_to_imgur.returning[0];

        return reply.code(200).send(fileInfo);
    }

    return reply.code(500).send(response);
}

export async function uploadImgur(
    req: FastifyRequest<{
        Body: FileUploadInput
    }>,
    reply: FastifyReply,
) {

    const fileData = req.body.input.base64

    const userId = req.body.input.userId

    // imgur upload
    let imgurResult = await axios.post(process.env.IMGUR_UPLOAD_URL as string, {
        image: fileData,
    }, {
        headers: {
            Authorization: `Bearer ${process.env.IMGUR_ACCESS_TOKEN}`
        }
    });

    if (imgurResult.data.success === false) {
        return reply.code(500).send(imgurResult.data);
    }

    let response = await hasuraAdminQuery(`
        mutation InsertImages($url: String, $author_uid: uuid) {
          insert_nodeart_images(objects: {url: $url, author_uid: $author_uid}) {
            affected_rows
            returning {
              id
              url
              created_at
              collection_id
              author_uid
            }
          }
        }
    `, {
        url: imgurResult.data.data.link,
        author_uid: userId
    });

    if (!response.errors) {
        // let insertImageResult = response.data.insert_nodeart_images.returning[0];
        // console.log('Result', insertImageResult);

        return reply.code(201).send({
            url: imgurResult.data.data.link,
            mimetype:  imgurResult.data.data.type,
            size:  imgurResult.data.data.size
        });
    }

    reply.code(500).send(response);
}