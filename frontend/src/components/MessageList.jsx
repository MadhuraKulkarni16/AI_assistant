const MessageList = ({ messages }) => {
  return (
    <div style={styles.container}>
      {messages.map((message, index) => (
        <div key={index} style={styles.messageWrapper}>
          {message.type === 'system' && (
            <div style={styles.systemMessage}>
              <svg style={styles.systemIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{message.content}</span>
            </div>
          )}

          {message.type === 'user' && (
            <div style={styles.userMessage}>
              <div style={styles.messageHeader}>
                <span style={styles.messageLabel}>You</span>
                <span style={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div style={styles.userMessageContent}>{message.content}</div>
            </div>
          )}

          {message.type === 'assistant' && (
            <div style={styles.assistantMessage}>
              <div style={styles.messageHeader}>
                <div style={styles.assistantLabel}>
                  <svg style={styles.assistantIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <span>Assistant</span>
                </div>
                <span style={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div style={styles.assistantMessageContent}>{message.content}</div>
              
              {/* Sources section hidden for cleaner UI */}
              {/* {message.sources && message.sources.length > 0 && (
                <div style={styles.sources}>
                  <div style={styles.sourcesHeader}>
                    <svg style={styles.sourcesIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Sources ({message.sources.length})</span>
                  </div>
                  <div style={styles.sourcesList}>
                    {message.sources.map((source, idx) => (
                      <div key={idx} style={styles.sourceItem}>
                        <div style={styles.sourceHeader}>
                          <span style={styles.sourceLabel}>Chunk {source.chunkIndex + 1}</span>
                          <span style={styles.sourceScore}>
                            Relevance: {source.relevanceScore}
                          </span>
                        </div>
                        <div style={styles.sourceContent}>{source.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}

              {message.metadata && (
                <div style={styles.metadata}>
                  <span style={styles.metadataItem}>
                    ⏱️ {message.metadata.responseTime}
                  </span>
                </div>
              )}
            </div>
          )}

          {message.type === 'error' && (
            <div style={styles.errorMessage}>
              <svg style={styles.errorIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{message.content}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  messageWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  systemMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#ebf8ff',
    border: '1px solid #bee3f8',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#2c5282',
  },
  systemIcon: {
    width: '20px',
    height: '20px',
    flexShrink: 0,
  },
  userMessage: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
    fontSize: '12px',
    color: '#718096',
  },
  messageLabel: {
    fontWeight: '600',
    color: '#2d3748',
  },
  assistantLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: '600',
    color: '#2d3748',
  },
  assistantIcon: {
    width: '16px',
    height: '16px',
  },
  messageTime: {
    fontSize: '11px',
  },
  userMessageContent: {
    padding: '12px 16px',
    backgroundColor: '#4299e1',
    color: '#ffffff',
    borderRadius: '12px 12px 4px 12px',
    fontSize: '14px',
    lineHeight: '1.5',
    wordWrap: 'break-word',
  },
  assistantMessageContent: {
    padding: '12px 16px',
    backgroundColor: '#f7fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px 12px 12px 4px',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#2d3748',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  sources: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
  },
  sourcesHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#4a5568',
  },
  sourcesIcon: {
    width: '16px',
    height: '16px',
  },
  sourcesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sourceItem: {
    padding: '8px',
    backgroundColor: '#f7fafc',
    borderRadius: '6px',
    fontSize: '12px',
  },
  sourceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  sourceLabel: {
    fontWeight: '600',
    color: '#2d3748',
  },
  sourceScore: {
    color: '#718096',
    fontSize: '11px',
  },
  sourceContent: {
    color: '#4a5568',
    lineHeight: '1.4',
  },
  metadata: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
    fontSize: '11px',
    color: '#718096',
  },
  metadataItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#fff5f5',
    border: '1px solid #fc8181',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#c53030',
  },
  errorIcon: {
    width: '20px',
    height: '20px',
    flexShrink: 0,
  },
};

export default MessageList;

// Made with Bob
