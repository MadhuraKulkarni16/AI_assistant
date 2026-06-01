import { useState } from 'react';
import PDFUploader from './components/PDFUploader';
import ChatInterface from './components/ChatInterface';

function App() {
  const [documentInfo, setDocumentInfo] = useState(null);

  const handleUploadSuccess = (data) => {
    setDocumentInfo(data);
  };

  const handleNewDocument = () => {
    setDocumentInfo(null);
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <svg style={styles.logoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h1 style={styles.title}>PDF Q&A Assistant</h1>
          </div>
          <p style={styles.subtitle}>
            Upload a PDF and ask questions about its content using AI
          </p>
        </div>
      </header>

      <main style={styles.main}>
        {!documentInfo ? (
          <div style={styles.uploadSection}>
            <div style={styles.features}>
              <div style={styles.feature}>
                <svg style={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <h3 style={styles.featureTitle}>Fast Processing</h3>
                <p style={styles.featureText}>
                  Powered by Groq for lightning-fast responses
                </p>
              </div>
              <div style={styles.feature}>
                <svg style={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 style={styles.featureTitle}>Smart Retrieval</h3>
                <p style={styles.featureText}>
                  RAG pipeline with ChromaDB vector search
                </p>
              </div>
              <div style={styles.feature}>
                <svg style={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <h3 style={styles.featureTitle}>Accurate Answers</h3>
                <p style={styles.featureText}>
                  Context-aware responses with source citations
                </p>
              </div>
            </div>

            <PDFUploader onUploadSuccess={handleUploadSuccess} />
          </div>
        ) : (
          <div style={styles.chatSection}>
            <ChatInterface documentInfo={documentInfo} />
            <button onClick={handleNewDocument} style={styles.newDocButton}>
              <svg style={styles.newDocIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Upload New Document
            </button>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Built with LangGraph, RAG, ChromaDB, and Groq
        </p>
        <div style={styles.techStack}>
          <span style={styles.techBadge}>Node.js</span>
          <span style={styles.techBadge}>React</span>
          <span style={styles.techBadge}>LangGraph</span>
          <span style={styles.techBadge}>ChromaDB</span>
          <span style={styles.techBadge}>Groq</span>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f7fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '24px 20px',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    color: '#4299e1',
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: '700',
    color: '#2d3748',
  },
  subtitle: {
    margin: 0,
    fontSize: '16px',
    color: '#718096',
  },
  main: {
    flex: 1,
    padding: '20px 20px 40px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
  },
  uploadSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '20px',
  },
  feature: {
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
  },
  featureIcon: {
    width: '40px',
    height: '40px',
    color: '#4299e1',
    margin: '0 auto 12px',
  },
  featureTitle: {
    margin: '0 0 8px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#2d3748',
  },
  featureText: {
    margin: 0,
    fontSize: '14px',
    color: '#718096',
    lineHeight: '1.5',
  },
  chatSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  newDocButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#ffffff',
    border: '2px solid #4299e1',
    borderRadius: '8px',
    color: '#4299e1',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    alignSelf: 'center',
  },
  newDocIcon: {
    width: '20px',
    height: '20px',
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    padding: '24px 20px',
    textAlign: 'center',
  },
  footerText: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    color: '#718096',
  },
  techStack: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  techBadge: {
    padding: '4px 12px',
    backgroundColor: '#ebf8ff',
    color: '#2c5282',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
};

export default App;

// Made with Bob
