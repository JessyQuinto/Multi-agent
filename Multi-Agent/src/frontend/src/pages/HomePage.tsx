import React, { useState } from 'react';
import {
    makeStyles,
    Title1,
    Title2,
    Subtitle1,
    tokens,
    Divider,
    Button,
    Input,
} from '@fluentui/react-components';
import {
    DocumentPdfRegular,
    CalendarClockRegular,
    MoneyHandRegular,
    PersonSupportRegular,
    SendRegular,
    ChevronDownRegular,
    ChevronUpRegular,
    AddRegular,
    MicRegular,
} from '@fluentui/react-icons';
import { ServiceCard } from '../components/content/ServiceCard';
import { TicketList } from '../components/content/TicketList';
import InlineToaster, { useInlineToaster } from '../components/toast/InlineToaster';

const useStyles = makeStyles({
    container: {
        minHeight: '100vh',
        backgroundColor: tokens.colorNeutralBackground2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
    },
    content: {
        maxWidth: '900px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
    },
    greetingSection: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    greeting: {
        fontSize: '32px',
        fontWeight: 600,
        color: tokens.colorNeutralForeground1,
    },
    subGreeting: {
        fontSize: '20px',
        color: tokens.colorNeutralForeground2,
    },
    chatInputContainer: {
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: '28px',
        padding: '20px 24px', // Increased padding for "gordito"
        boxShadow: tokens.shadow8,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '64px', // Make it taller
    },
    chatInput: {
        flex: 1,
        border: 'none',
        fontSize: '16px',
        minHeight: '24px', // Ensure minimum height
        '::placeholder': {
            color: tokens.colorNeutralForeground3,
        },
    },
    suggestionsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        justifyContent: 'center',
    },
    suggestionChip: {
        backgroundColor: tokens.colorNeutralBackground1,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        borderRadius: '20px',
        padding: '10px 20px',
        fontSize: '14px',
        color: tokens.colorNeutralForeground1,
        cursor: 'pointer',
        transition: 'all 0.2s',
        ':hover': {
            backgroundColor: tokens.colorNeutralBackground1Hover,
            boxShadow: tokens.shadow4,
        },
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
    },
    collapsibleSection: {
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: '8px',
        padding: '20px',
        boxShadow: tokens.shadow2,
    },
});

const HomePage: React.FC = () => {
    const styles = useStyles();
    const { showToast } = useInlineToaster();
    const [chatInput, setChatInput] = useState('');
    const [isRequestsExpanded, setIsRequestsExpanded] = useState(false);
    const [isChatMode, setIsChatMode] = useState(false);
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);

    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        // Add user message immediately
        const newMessages = [...messages, { role: 'user', content: text } as const];
        setMessages(newMessages);
        setIsChatMode(true);
        setIsLoading(true);

        try {
            const response = await fetch('/api/v3/hr/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Assuming auth is handled via cookies or we need to add a header if we had a token
                    // For now, relying on the backend to identify user via mock or existing session
                },
                body: JSON.stringify({ message: text }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // Assuming data.data is the response string or object
            // The backend returns { status: "success", data: result }
            // result from dispatcher is currently just the string response or a list of events
            // Let's assume it returns a string for now, or we adjust based on DispatcherService

            const assistantMessage = typeof data.data === 'string' ? data.data : JSON.stringify(data.data);

            setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);

        } catch (error) {
            console.error('Error sending message:', error);
            showToast("Error al conectar con el asistente.", "error");
            setMessages(prev => [...prev, { role: 'assistant', content: "Lo siento, hubo un error al procesar tu solicitud." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleServiceClick = (service: string) => {
        const message = `Quiero información sobre ${service}`;
        setChatInput('');
        sendMessage(message);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setChatInput('');
        sendMessage(suggestion);
    };

    const handleChatSubmit = () => {
        if (chatInput.trim()) {
            const text = chatInput;
            setChatInput('');
            sendMessage(text);
        }
    };

    const handleBackToHome = () => {
        setIsChatMode(false);
        setMessages([]);
        setChatInput('');
    };

    const suggestions = [
        "Explícame la política de vacaciones",
        "¿Cómo solicito un certificado laboral?",
        "¿Cuándo es el próximo pago de nómina?",
        "Consultar mi saldo de vacaciones",
    ];

    // Full-screen chat mode
    if (isChatMode) {
        return (
            <>
                <InlineToaster />
                <div style={{
                    minHeight: '100vh',
                    backgroundColor: tokens.colorNeutralBackground1,
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {/* Chat Header */}
                    <div style={{
                        padding: '16px 24px',
                        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                    }}>
                        <Button
                            appearance="subtle"
                            onClick={handleBackToHome}
                        >
                            ← Volver
                        </Button>
                        <Title2>Copilot Assistant</Title2>
                    </div>

                    {/* Messages Area */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '40px 20px',
                        maxWidth: '800px',
                        width: '100%',
                        margin: '0 auto',
                    }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                marginBottom: '24px',
                                display: 'flex',
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            }}>
                                <div style={{
                                    maxWidth: '70%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    backgroundColor: msg.role === 'user'
                                        ? tokens.colorBrandBackground
                                        : tokens.colorNeutralBackground2,
                                    color: msg.role === 'user'
                                        ? tokens.colorNeutralForegroundOnBrand
                                        : tokens.colorNeutralForeground1,
                                }}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat Input at Bottom */}
                    <div style={{
                        padding: '24px',
                        borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
                        backgroundColor: tokens.colorNeutralBackground1,
                    }}>
                        <div style={{
                            maxWidth: '800px',
                            margin: '0 auto',
                        }}>
                            <div className={styles.chatInputContainer}>
                                <Button
                                    appearance="subtle"
                                    icon={<AddRegular />}
                                    size="medium"
                                />
                                <Input
                                    className={styles.chatInput}
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleChatSubmit();
                                        }
                                    }}
                                    placeholder="Pregunta cualquier cosa"
                                    appearance="outline"
                                />
                                <Button
                                    appearance="subtle"
                                    icon={<MicRegular />}
                                    size="medium"
                                />
                                <Button
                                    appearance="primary"
                                    icon={<SendRegular />}
                                    onClick={handleChatSubmit}
                                    disabled={!chatInput.trim()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Landing page (original view)
    return (
        <>
            <InlineToaster />
            <div className={styles.container}>
                <div className={styles.content}>
                    {/* Greeting Section */}
                    <div className={styles.greetingSection}>
                        <div className={styles.greeting}>
                            Buenas tardes, JESSY
                        </div>
                        <div className={styles.subGreeting}>
                            ¿En qué puedo ayudarte hoy?
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className={styles.chatInputContainer}>
                        <Button
                            appearance="subtle"
                            icon={<AddRegular />}
                            size="medium"
                        />
                        <Input
                            className={styles.chatInput}
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleChatSubmit();
                                }
                            }}
                            placeholder="Pregunta cualquier cosa"
                            appearance="outline"
                        />
                        <Button
                            appearance="subtle"
                            icon={<MicRegular />}
                            size="medium"
                        />
                        <Button
                            appearance="primary"
                            icon={<SendRegular />}
                            onClick={handleChatSubmit}
                            disabled={!chatInput.trim()}
                        />
                    </div>

                    {/* Suggestion Chips */}
                    <div className={styles.suggestionsContainer}>
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                className={styles.suggestionChip}
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>

                    <Divider />

                    {/* Servicios Frecuentes */}
                    <div className={styles.section}>
                        <Title2>Servicios Frecuentes</Title2>
                        <div className={styles.grid}>
                            <ServiceCard
                                title="Certificados"
                                description="Genera certificados laborales y de ingresos."
                                icon={<DocumentPdfRegular fontSize={32} />}
                                onClick={() => handleServiceClick('Certificados')}
                            />
                            <ServiceCard
                                title="Vacaciones"
                                description="Consulta saldo y solicita días de descanso."
                                icon={<CalendarClockRegular fontSize={32} />}
                                onClick={() => handleServiceClick('Vacaciones')}
                            />
                            <ServiceCard
                                title="Nómina"
                                description="Consulta tus desprendibles de pago."
                                icon={<MoneyHandRegular fontSize={32} />}
                                onClick={() => handleServiceClick('Nómina')}
                            />
                            <ServiceCard
                                title="Beneficios"
                                description="Revisa tus beneficios activos."
                                icon={<PersonSupportRegular fontSize={32} />}
                                onClick={() => handleServiceClick('Beneficios')}
                            />
                        </div>
                    </div>

                    {/* Mis Solicitudes Recientes (Collapsible) */}
                    <div className={styles.collapsibleSection}>
                        <div className={styles.sectionHeader}>
                            <Title2>Mis Solicitudes Recientes</Title2>
                            <Button
                                appearance="subtle"
                                icon={isRequestsExpanded ? <ChevronUpRegular /> : <ChevronDownRegular />}
                                onClick={() => setIsRequestsExpanded(!isRequestsExpanded)}
                            >
                                {isRequestsExpanded ? 'Ocultar' : 'Mostrar'}
                            </Button>
                        </div>
                        {isRequestsExpanded && (
                            <>
                                <Divider style={{ margin: '16px 0' }} />
                                <TicketList />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;