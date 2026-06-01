import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadPDF } from '../services/api';

const PDFUploader = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const result = await uploadPDF(file, (progress) => {
        setUploadProgress(progress);
      });

      if (result.success) {
        onUploadSuccess(result.data);
        setUploadProgress(100);
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 1000);
      }
    } catch (err) {
      setError(err.error?.message || 'Failed to upload PDF');
      setUploading(false);
      setUploadProgress(0);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: uploading
  });

  return (
    <div style={styles.container}>
      <div
        {...getRootProps()}
        style={{
          ...styles.dropzone,
          ...(isDragActive ? styles.dropzoneActive : {}),
          ...(uploading ? styles.dropzoneDisabled : {})
        }}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div style={styles.uploadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.uploadingText}>Uploading and processing PDF...</p>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${uploadProgress}%`
                }}
              ></div>
            </div>
            <p style={styles.progressText}>{uploadProgress}%</p>
          </div>
        ) : (
          <div style={styles.dropzoneContent}>
            <svg
              style={styles.icon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {isDragActive ? (
              <p style={styles.dropzoneText}>Drop the PDF here...</p>
            ) : (
              <>
                <p style={styles.dropzoneText}>
                  Drag & drop a PDF file here, or click to select
                </p>
                <p style={styles.dropzoneSubtext}>
                  Maximum file size: 10MB
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <div style={styles.error}>
          <svg
            style={styles.errorIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
  },
  dropzone: {
    border: '2px dashed #cbd5e0',
    borderRadius: '8px',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#f7fafc',
  },
  dropzoneActive: {
    borderColor: '#4299e1',
    backgroundColor: '#ebf8ff',
  },
  dropzoneDisabled: {
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  dropzoneContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  icon: {
    width: '48px',
    height: '48px',
    color: '#4299e1',
  },
  dropzoneText: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2d3748',
    margin: 0,
  },
  dropzoneSubtext: {
    fontSize: '14px',
    color: '#718096',
    margin: 0,
  },
  uploadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #4299e1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  uploadingText: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2d3748',
    margin: 0,
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4299e1',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '14px',
    color: '#718096',
    margin: 0,
  },
  error: {
    marginTop: '16px',
    padding: '12px 16px',
    backgroundColor: '#fff5f5',
    border: '1px solid #fc8181',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#c53030',
    fontSize: '14px',
  },
  errorIcon: {
    width: '20px',
    height: '20px',
    flexShrink: 0,
  },
};

// Add keyframes for spinner animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default PDFUploader;

// Made with Bob
