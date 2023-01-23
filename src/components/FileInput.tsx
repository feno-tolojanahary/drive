import React, { useState } from 'react';

interface Props {
  onFileSelected: (file: File | undefined) => void,
  input: React.RefObject<HTMLInputElement>
}

const FileInput: React.FC<Props> = ({ onFileSelected, input }: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string | ArrayBuffer | null | undefined>();
  
  const types = ['image/png', 'image/jpeg'];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    onFileSelected(selectedFile);

    // create a preview of the selected image
    const reader = new FileReader();
    reader.onload = (e) => {
        if (types.includes(selectedFile?.type as string)) setPreviewUrl(e.target?.result);
    }
    reader.readAsDataURL(selectedFile as Blob);
  };

  return (
    <div className="flex-col items-center p-4 hidden">
      <input
        className="w-64 p-2 rounded-md shadow-md bg-white border border-gray-400 focus:outline-none focus:border-indigo-500"
        type="file"
        onChange={handleFileChange}
        ref={input}
      />
      {previewUrl && (
        <img
          className="w-64 h-64 rounded-md shadow-md object-cover"
          src={previewUrl as string}
          alt="Preview"
        />
      )}
    </div>
  );
};

export default FileInput;