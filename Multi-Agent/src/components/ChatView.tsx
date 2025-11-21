import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    makeStyles,
    tokens,
    Button,
    Avatar,
    Text,
} from "@fluentui/react-components";
import {
    SendRegular,
    ArrowLeftRegular,
    PersonRegular,
    BotRegular,
    AddRegular,
    MicRegular,
} from "@fluentui/react-icons";

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: tokens.colorNeutralBackground1,
    },
    header: {
        display: "flex",
        alignItems: "center",
        padding: "16px 24px",
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
        backgroundColor: tokens.colorNeutralBackground1,
    },
    backButton: {
        marginRight: "16px",
    },
    messagesContainer: {
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    messageRow: {
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
    },
    userMessageRow: {
        flexDirection: "row-reverse",
    },
    messageContent: {
        maxWidth: "70%",
        padding: "12px 16px",
        borderRadius: "12px",
    },
    userMessage: {
        backgroundColor: tokens.colorBrandBackground,
        color: tokens.colorNeutralForegroundOnBrand,
    },
    aiMessage: {
        backgroundColor: tokens.colorNeutralBackground3,
        color: tokens.colorNeutralForeground1,
    },
    inputContainer: {
        padding: "16px 24px",
        borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
        backgroundColor: tokens.colorNeutralBackground1,
    },
    inputWrapper: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: "32px",
        boxShadow: tokens.shadow8,
        padding: "12px 24px",
    },
    textarea: {
        flex: 1,
        border: "none",
        outline: "none",
        resize: "none",
        fontSize: "16px",
        fontFamily: "inherit",
        backgroundColor: "transparent",
        color: tokens.colorNeutralForeground1,
        minHeight: "24px",
        maxHeight: "120px",
    },
    iconButton: {
        cursor: "pointer",
        color: tokens.colorNeutralForeground3,
        fontSize: "20px",
    },
    sendButton: {
        cursor: "pointer",
        color: tokens.colorBrandForeground1,
        fontSize: "20px",
    },
});

interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
}

const ChatView: React.FC = () => {
    const styles = useStyles();
    const location = useLocation();
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const initialMessage = location.state?.message || "";
    const [messages, setMessages] = useState<Message[]>(
        initialMessage
            ? [
                {
                    id: "1",
                    text: initialMessage,
                    sender: "user",
                    timestamp: new Date(),
                },
                {
                    id: "2",
                    text: "Hola, soy tu asistente de RRHH. ¿En qué puedo ayudarte hoy?",
                    sender: "ai",
                    timestamp: new Date(),
                },
            ]
            : []
    );
    const [inputValue, setInputValue] = useState("");

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (inputValue.trim()) {
            const newUserMessage: Message = {
                id: Date.now().toString(),
                text: inputValue,
                sender: "user",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, newUserMessage]);
            setInputValue("");

            // Simulate AI response
            setTimeout(() => {
                const aiResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "Entiendo tu consulta. Déjame ayudarte con eso...",
                    sender: "ai",
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, aiResponse]);
            }, 1000);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleBack = () => {
        navigate("/dashboard");
    };

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <Button
                    appearance="subtle"
                    icon={<ArrowLeftRegular />}
                    onClick={handleBack}
                    className={styles.backButton}
                />
                <Text weight="semibold" size={400}>
                    Asistente de RRHH
                </Text>
            </div>

            <div className={styles.messagesContainer}>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`${styles.messageRow} ${message.sender === "user" ? styles.userMessageRow : ""
                            }`}
                    >
                        <Avatar
                            icon={message.sender === "user" ? <PersonRegular /> : <BotRegular />}
                            color={message.sender === "user" ? "brand" : "colorful"}
                        />
                        <div
                            className={`${styles.messageContent} ${message.sender === "user" ? styles.userMessage : styles.aiMessage
                                }`}
                        >
                            <Text>{message.text}</Text>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputContainer}>
                <div className={styles.inputWrapper}>
                    <AddRegular className={styles.iconButton} />
                    <textarea
                        ref={textareaRef}
                        className={styles.textarea}
                        placeholder="Escribe tu mensaje..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        rows={1}
                    />
                    <MicRegular className={styles.iconButton} />
                    <SendRegular
                        className={styles.sendButton}
                        onClick={handleSend}
                        style={{ opacity: inputValue.trim() ? 1 : 0.5 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatView;
