import { ApiResponseModel, PresignedUrlModel } from '@/src/models/apiModel';
import { getCookie } from 'cookies-next';
import React, { useState, useEffect, ChangeEvent } from 'react';

interface UploadProps{
    updateKey: (key: string) => void;
}
const imageMimeType = /image\/(png|jpg|jpeg)/i;

const Upload: React.FC<UploadProps> = ({
    updateKey
}) => {
    const [file, setFile] = useState<File>();

    const handleFileChange = async (e: any) => {
        const eventFile = e.target.files[0];

        if (!eventFile || !eventFile.type.match(imageMimeType)) {
            alert("Image mime type is not valid");
            return;
        }
        setFile(eventFile);
        if(file) await uploadFile();
    };

    async function uploadFile() {
        try {
            const token : string = getCookie('jwt_auth')?.toString() || '';
            const headers = {Authorization: `Bearer ${token}`};
            const bodyData = {fileType: file?.type};
            let res = await fetch('/api/upload', {headers, method: 'POST', body: JSON.stringify(bodyData)});
            let response: ApiResponseModel<PresignedUrlModel> = await res.json();
        
            if(!response?.data?.presignedUrl) {
                console.error(response?.error);
                return;
            }
        
            if(!file) {
                console.error('no image selected');
                return;
            }

            await fetch(response.data.presignedUrl, {method: 'PUT', body: file});
            console.log('image uploaded');
            updateKey(response?.data?.key);
        } catch (error) {
            console.error({error});
        }
    }

    return (
        <div className="w-full">
            <label
                className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">

                <input type="file" name="file_upload" className="hidden" accept="image/jpeg, image/png, image/jpg" onChange={handleFileChange}/>
                {file ?
                    <div>
                        <button onClick={() => setFile(undefined)} type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Close menu</span>
                            <svg className="h-2 w-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img  className="object-scale-down h-28 w-28" src={URL.createObjectURL(file)} alt="Thumb" />
                    </div>
                    : 
                    <span className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="font-medium text-gray-600">
                            <span>Drop files to Attach, or </span>
                            <span className="text-blue-600 underline">browse</span>
                        </span>
                    </span>}
            </label>
        </div>
    )
}

export default Upload;