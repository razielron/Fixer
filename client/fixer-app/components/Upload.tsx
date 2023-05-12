import React, { useState, useEffect, ChangeEvent } from 'react';

interface UploadProps{
    onChange: any;
}
const imageMimeType = /image\/(png|jpg|jpeg)/i;

const Upload: React.FC<UploadProps> = ({
    onChange
}) => {
    const [file, setFile] = useState<File>();
    const [fileDataURL, setFileDataURL] = useState(null);
    
    const handleFileChange = (e: any) => {
        const eventFile = e.target.files[0];

        if (!eventFile || !eventFile.type.match(imageMimeType)) {
            alert("Image mime type is not valid");
            return;
        }
        setFile(eventFile);
    };

    return (
        <div className="w-full">
            <label
                className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
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
                </span>
                <input type="file" name="file_upload" className="hidden" accept="image/jpeg, image/png, image/jpg" onChange={handleFileChange}/>
                {file ?
                    <p>
                        <img className="object-scale-down h-28 w-28" src={URL.createObjectURL(file)} alt="Thumb" />
                    </p>
                    : null}
            </label>
        </div>
    )
}

export default Upload;