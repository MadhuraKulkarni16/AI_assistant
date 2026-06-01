import { useState, useRef, useEffect } from 'react';
import { queryDocument } from '../services/api';
import MessageList from './MessageList';

const ChatInterface = ({ documentInfo }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message when document is loaded
    if (documentInfo) {
      setMessages([
        {
          type: 'system',
          content: `PDF "${documentInfo.filename}" loaded successfully! (${documentInfo.numPages} pages, ${documentInfo.totalChunks} chunks). Ask me anything about this document.`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [documentInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await queryDocument(documentInfo.documentId, inputValue);

      const assistantMessage = {
        type: 'assistant',
        content: result.data.answer,
        sources: result.data.sources,
        metadata: result.data.metadata,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'error',
        content: error.error?.message || 'Failed to get answer. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Chat with your PDF</h2>
        <div style={styles.documentInfo}>
          <svg style={styles.documentIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span style={styles.documentName}>{documentInfo?.filename}</span>
        </div>
      </div>

      <div style={styles.messagesContainer}>
        <MessageList messages={messages} />
        {isLoading && (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingDots}>
              <span style={styles.dot}></span>
              <span style={styles.dot}></span>
              <span style={styles.dot}></span>
            </div>
            <span style={styles.loadingText}>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={styles.inputForm}>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question about your PDF..."
          style={styles.input}
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          style={{
            ...styles.sendButton,
            ...((!inputValue.trim() || isLoading) ? styles.sendButtonDisabled : {})
          }}
        >
          <svg style={styles.sendIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '300px',
    maxHeight: '80vh',
    height: 'auto',
    maxWidth: '800px',
    margin: '0 auto',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    transition: 'height 0.3s ease',
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f7fafc',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#2d3748',
  },
  documentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#718096',
  },
  documentIcon: {
    width: '16px',
    height: '16px',
  },
  documentName: {
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    marginTop: '12px',
  },
  loadingDots: {
    display: 'flex',
    gap: '4px',
  },
  dot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#4299e1',
    borderRadius: '50%',
    animation: 'bounce 1.4s infinite ease-in-out both',
  },
  loadingText: {
    fontSize: '14px',
    color: '#718096',
  },
  inputForm: {
    display: 'flex',
    gap: '12px',
    padding: '16px 20px',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#f7fafc',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #cbd5e0',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'none',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  sendButton: {
    padding: '12px 20px',
    backgroundColor: '#4299e1',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#cbd5e0',
    cursor: 'not-allowed',
  },
  sendIcon: {
    width: '20px',
    height: '20px',
  },
};

// Add keyframes for loading animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
  
  .dot:nth-child(1) {
    animation-delay: -0.32s;
  }
  
  .dot:nth-child(2) {
    animation-delay: -0.16s;
  }
`;
document.head.appendChild(styleSheet);

export default ChatInterface;

// Made with Bob
