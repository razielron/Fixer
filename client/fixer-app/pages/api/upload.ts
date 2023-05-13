import type { NextApiRequest, NextApiResponse } from 'next';
import {ApiResponseModel, PresignedUrlModel} from '@/src/models/apiModel';
import axios from 'axios';

const baseUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}`;
const uploadPath = '/s3/upload/';
let headers = { Accept: 'application/json', Authorization: '', 'Content-Type': 'application/json' };

async function getUploadPresignedUrl(fileType: string, token: string) : Promise<ApiResponseModel<PresignedUrlModel>> {
    try {
        headers.Authorization = token;
        let uploadUrl: URL = new URL(uploadPath, baseUrl);
        let fileTypeModel = {fileType};
        let { data } = await axios.post(uploadUrl.toString(), fileTypeModel, {headers});

        return data as ApiResponseModel<PresignedUrlModel>;
    }
    catch(error: unknown) {
        let errorMessage = `Internal error when trying to get upload link for ${fileType}`;
        console.log({error});
        
        return {error: errorMessage};
    }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseModel<PresignedUrlModel>>
) {
    try {
        const token = req.headers.authorization || '';
        const bodyJson = JSON.parse(req.body);
        const fileType = bodyJson.fileType;
        let response: ApiResponseModel<PresignedUrlModel> = await getUploadPresignedUrl(fileType, token);
        res.status(200).json(response);
    }
    catch(error: unknown) {
        console.log({error});
        res.status(500).json({error: `internal error: couldn't get upload link`});
    }
}
