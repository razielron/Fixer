import type { NextApiRequest, NextApiResponse } from 'next';
import {ApiResponseModel, PresignedUrlModel} from '@/src/models/apiModel';
import axios from 'axios';

const baseUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}`;
const uploadPath = '/api/upload/';

async function getUploadPresignedUrl(fileType: string) : Promise<ApiResponseModel<PresignedUrlModel>> {
    try {
        let uploadBaseUrl: URL = new URL(uploadPath, baseUrl);
        let uploadUrl : URL = new URL (fileType, uploadBaseUrl);
        let { data } = await axios.get(uploadUrl.toString());

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
  res: NextApiResponse
) {
    try {
        let response: ApiResponseModel<PresignedUrlModel> = await getUploadPresignedUrl(req?.query?.fileType as string);
        console.log({response});
        res.status(201).json(response);
    }
    catch(error: unknown) {
        console.log({error});
        res.status(500).json({error: `internal error: couldn't get upload link`});
    }
}
///////////////////////////////////////////////////////////////////////////////////////////
import {ApiResponseModel, PresignedUrlModel} from "@/src/models/apiModel";

const [image, setImage] = useState(null as File | null);

function renameFile(file: File, newName: string) : FormData {
    let results = new FormData();
    results.append('file', file, newName);
    return results;
  }

  async function uploadFile() {
    let res = await fetch('/api/issue', {method: 'POST', headers, body: JSON.stringify(createIssue)});
    let response: ApiResponseModel<PresignedUrlModel> = await res.json();
    console.log({response});

    if(!response?.data?.presignedUrl) {
      console.error(response?.error);
      return;
    }

    if(!image) {
      console.error('no image selected');
      return;
    }

    let uploadImage = renameFile(image, response?.data?.key);

    await fetch(response?.data?.presignedUrl, {method: 'PUT', headers: {'Content-Tpye': image.type}, body: uploadImage});
    console.log('image uploaded');
    setImage(null);
  }

  <Input
        onChange = {(event:any)=> setImage(event.target.files[0])}
        id = "image"
        type = "file"
        value = ''
        placeHolder = "Choose Image"
    />