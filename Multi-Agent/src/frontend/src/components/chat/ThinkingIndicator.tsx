import React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';
import './ThinkingIndicator.css';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        borderRadius: '12px',
        backgroundColor: tokens.colorNeutralBackground2,
        maxWidth: 'fit-content',
    },
    dotsContainer: {
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
    },
    text: {
        fontSize: '14px',
        color: tokens.colorNeutralForeground2,
        fontStyle: 'italic',
    },
});

interface ThinkingIndicatorProps {
    text?: string;
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({
    text = "Pensando..."
}) => {
    const styles = useStyles();

    return (
        <div className={styles.container}>
            <div className={styles.dotsContainer}>
                <div className="thinking-dot thinking-dot-1" />
                <div className="thinking-dot thinking-dot-2" />
                <div className="thinking-dot thinking-dot-3" />
                <div className="thinking-dot thinking-dot-4" />
                <div className="thinking-dot thinking-dot-5" />
                <div className="thinking-dot thinking-dot-6" />
            </div>
            <span className={styles.text}>{text}</span>
        </div>
    );
};

export default ThinkingIndicator;
