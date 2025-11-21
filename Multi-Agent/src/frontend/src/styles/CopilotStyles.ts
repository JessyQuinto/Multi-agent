import { makeStyles, tokens } from '@fluentui/react-components';

export const useCopilotStyles = makeStyles({
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground1, // Standard neutral background
    borderLeft: `1px solid ${tokens.colorNeutralStroke1}`,
    position: 'relative',
    transition: 'width 0.3s ease-in-out', // Smooth transition for toggle
  },
  chatHeader: {
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    // Custom Scrollbar
    '::-webkit-scrollbar': {
      width: '6px',
    },
    '::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '::-webkit-scrollbar-thumb': {
      background: tokens.colorNeutralStroke1,
      borderRadius: '3px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: tokens.colorNeutralStroke1Hover,
    },
  },
  greetingContainer: {
    marginTop: '60px',
    marginBottom: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    alignItems: 'center', // Center the content
  },
  greetingText: {
    fontSize: '24px', // Reduced from 32px
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    lineHeight: '32px', // Reduced from 40px
    fontFamily: '"Segoe UI", "Segoe UI Web (West European)", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
    textAlign: 'center', // Center the text
    maxWidth: '400px', // Limit width for better readability
  },
  suggestionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center instead of flex-end
    gap: '12px',
    marginBottom: '20px',
    width: '100%', // Full width for centering
  },
  suggestionChip: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '20px',
    padding: '10px 20px',
    fontSize: '14px',
    color: tokens.colorNeutralForeground1,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    boxShadow: tokens.shadow2,
  },
  inputContainer: {
    padding: '24px 40px 40px 40px',
    backgroundColor: 'transparent',
  },
  inputCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: '28px',
    padding: '16px',
    boxShadow: tokens.shadow8,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  inputField: {
    border: 'none',
    backgroundColor: 'transparent',
    padding: '8px 4px',
    fontSize: '16px',
    fontFamily: tokens.fontFamilyBase,
    resize: 'none',
    minHeight: '24px',
    ':focus': {
      outline: 'none',
    },
    '::placeholder': {
      color: tokens.colorNeutralForeground3,
    },
  },
  inputToolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  iconButton: {
    color: tokens.colorNeutralForeground1,
    ':hover': {
      color: tokens.colorBrandForeground1,
    },
  },
  messageBubble: {
    maxWidth: '85%',
    padding: '12px 16px',
    borderRadius: '12px',
    position: 'relative',
    lineHeight: '20px',
    fontSize: tokens.fontSizeBase300,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#EBF3FC',
    color: tokens.colorNeutralForeground1,
    borderBottomRightRadius: '4px',
  },
  agentMessage: {
    alignSelf: 'flex-start',
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    borderBottomLeftRadius: '4px',
    boxShadow: tokens.shadow2,
  },
  messageRow: {
    display: 'flex',
    gap: '12px',
    width: '100%',
  },
  agentRow: {
    justifyContent: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  avatar: {
    marginRight: '8px',
  },
});
