import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styles from './Uploader.module.css'
import { Grid, LinearProgress, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 5,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#008d3f;',
  },
}))(LinearProgress);

export default function Uploader({ form, setForm }) {
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      const url = "https://api.cloudinary.com/v1_1/dmdnwemxp/image/upload";
      setProgress(0);
      setUploadError(null);
      setIsUploading(true);

      const file = acceptedFiles[0];
      if (!file) {
        throw new Error('No file selected');
      }

      // Validate file size (2MB limit)
      if (file.size > 2097152) {
        throw new Error('File size exceeds 2MB limit');
      }

      console.log('Starting file upload:', file.name);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "logos1");

      console.log('Sending request to Cloudinary...');
      
      // Use XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentage = Math.round((e.loaded * 100) / e.total);
          setProgress(percentage);
        }
      };

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } else {
            reject(new Error('Upload failed'));
          }
        };
        xhr.onerror = () => reject(new Error('Network error'));
      });

      xhr.send(formData);
      
      const data = await uploadPromise;
      console.log('Cloudinary response:', data);

      if (data.secure_url) {
        console.log('Upload successful, updating form with new logo URL:', data.secure_url);
        setProgress(100);
        setForm(prevForm => ({
          ...prevForm,
          logo: data.secure_url
        }));
      } else {
        throw new Error('No secure URL received from Cloudinary');
      }
    } catch (error) {
      console.error('Error in file upload:', error);
      setUploadError(error.message);
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  }, [setForm]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png, image/gif',
    multiple: false,
    maxSize: 2097152, // 2MB
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.active : ''} ${uploadError ? styles.error : ''}`}
      >
        <input {...getInputProps()} />
        <div style={{ textAlign: 'center' }}>
          {uploadError ? (
            <Typography color="error">{uploadError}</Typography>
          ) : isUploading ? (
            <Typography>Uploading... {progress}%</Typography>
          ) : (
            <>
              <Typography>
                Drop logo here or click to upload
                {isDragActive && ' - Drop here!'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                (Max size: 2MB, Formats: JPG, PNG, GIF)
              </Typography>
            </>
          )}
        </div>
      </div>
      <Grid item style={{width: '100%', marginBottom: '20px'}}>
        {progress > 0 && <BorderLinearProgress variant="determinate" value={progress} />}
      </Grid>
    </>
  );
}

