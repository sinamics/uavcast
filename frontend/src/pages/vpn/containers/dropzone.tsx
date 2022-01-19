import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadConfigFileMutation } from '../../../graphql/generated/dist';

const Dropzone = () => {
  const [Upload] = useUploadConfigFileMutation();
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      Upload({ variables: { file: acceptedFiles[0] } });
    },
    [Upload]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false, maxFiles: 1 });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p className='border py-5 p-3'>Drop the .ovpn here ...</p>
    </div>
  );
};

export default Dropzone;
