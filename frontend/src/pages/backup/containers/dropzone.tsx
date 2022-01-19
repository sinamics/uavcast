import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Grid, Label } from 'semantic-ui-react';
import { useUploadDatabaseFileMutation } from '../../../graphql/generated/dist';

const DatabaseDropzone = () => {
  const [error, setError] = useState<string>('');
  const [Upload, { error: uploadError }] = useUploadDatabaseFileMutation({
    errorPolicy: 'all'
  });
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      if (!acceptedFiles.length) return setError('Wrong file format, please use the exact backup file');
      Upload({ variables: { file: acceptedFiles[0] } }).then(() => window.location.reload());
    },
    [Upload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    accept: '.gz'
  });

  return (
    <Grid stackable padded columns={1}>
      {uploadError && <p>{uploadError.message}</p>}
      {error && (
        <Grid.Column textAlign='center' width={16}>
          <Label className='themeBg' color='red'>
            {error}
          </Label>
        </Grid.Column>
      )}
      <Grid.Column>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <div className='border py-5 p-3'>
            <p>Drop the uavcast-backup file here, or click to select file ...</p>
            <em>Only .tar.gz files are allowed.</em>
          </div>
        </div>
      </Grid.Column>
    </Grid>
  );
};

export default DatabaseDropzone;
