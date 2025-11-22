import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    makeStyles,
    Title1,
    Text,
    Button,
    Card,
    CardHeader,
    tokens,
    Avatar,
} from "@fluentui/react-components";
import {
    DocumentRegular,
    CalendarRegular,
    MoneyRegular,
    BriefcaseRegular,
    ChatRegular,
    DocumentPdfRegular,
    AddRegular,
    MicRegular,
} from "@fluentui/react-icons";
import { useMsal } from "@azure/msal-react";
import type { AccountInfo } from "@azure/msal-browser";


// Estilos del Dashboard usando Fluent UI
const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 40px",
        gap: "24px",
        minHeight: "100%",
        background: `linear-gradient(180deg, ${tokens.colorBrandBackground2} 0%, ${tokens.colorNeutralBackground1} 100%)`,
    },
    greetingSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        marginTop: "16px",
        textAlign: "center",
    },
    greeting: {
        color: tokens.colorNeutralForeground1,
    },
    searchSection: {
        width: "100%",
        maxWidth: "600px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    quickActions: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px",
        maxWidth: "800px",
    },
    actionButton: {
        borderRadius: "999px",
        padding: "6px 16px",
    },
    // Grid responsive para las tarjetas de servicios
    servicesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
        width: "100%",
        maxWidth: "900px",
    },
    // Tarjetas con efecto hover
    activityCard: {
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(10px)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        ":hover": {
            transform: "translateY(-4px)",
            boxShadow: tokens.shadow16,
        },
    },
});

const DashboardComponent: React.FC = () => {
    const styles = useStyles();
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");
      const { accounts } = useMsal();
        const account: AccountInfo | undefined = accounts[0];

    // Preguntas de ejemplo para inicio rápido
    const sampleQuestions = [
        { label: "¿Cuántos días tengo de vacaciones al año?", icon: <ChatRegular /> },
        { label: "¿Cuál es la política de trabajo remoto?", icon: <ChatRegular /> },
        { label: "¿Cómo solicito un certificado laboral?", icon: <ChatRegular /> },
        { label: "¿Cuándo pagan la prima de servicios?", icon: <ChatRegular /> },
    ];

    // Categorías de servicios de RRHH
    const serviceCategories = [
        { title: "Certificados laborales", icon: <DocumentRegular /> },
        { title: "Constancias", icon: <DocumentPdfRegular /> },
        { title: "Vacaciones", icon: <CalendarRegular /> },
        { title: "Licencias", icon: <BriefcaseRegular /> },
        { title: "Beneficios", icon: <MoneyRegular /> },
        { title: "Consultas de nómina", icon: <MoneyRegular /> },
    ];

    // Navegar al chat con el mensaje del usuario
    const handleSend = () => {
        if (searchInput.trim()) {
            navigate("/chat", { state: { message: searchInput } });
        }
    };

    // Enviar mensaje al presionar Enter (sin Shift)
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Navegar al chat con una pregunta predefinida
    const handleQuestionClick = (question: string) => {
        navigate("/chat", { state: { message: question } });
    };

    // Navegar al chat con solicitud de servicio
    const handleServiceClick = (serviceName: string) => {
        navigate("/chat", { state: { message: `Necesito ayuda con ${serviceName.toLowerCase()}` } });
    };

    return (
        <div className={styles.root}>
            {/* Saludo personalizado */}
            <div className={styles.greetingSection}>
                <Title1 className={styles.greeting} style={{ fontSize: "22px" }}>Buenas tardes, {account?.name}</Title1>
                <Title1 className={styles.greeting} style={{ fontSize: "22px" }}>¿En qué puedo ayudarte hoy?</Title1>
            </div>

            {/* Barra de búsqueda / chat principal */}
            <div className={styles.searchSection}>
                <div style={{
                    width: '100%',
                    backgroundColor: tokens.colorNeutralBackground1,
                    borderRadius: '32px',
                    boxShadow: tokens.shadow8,
                    padding: '16px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    minHeight: '120px'
                }}>
                    {/* Área de texto para escribir mensajes */}
                    <textarea
                        placeholder="Pregunta cualquier cosa"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        style={{
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                            flex: 1,
                            minHeight: '60px',
                            fontSize: '16px',
                            fontFamily: 'inherit',
                            resize: 'none',
                            backgroundColor: 'transparent',
                            color: tokens.colorNeutralForeground1,
                            cursor: 'text'
                        }}
                    />
                    {/* Iconos de acción: adjuntar y micrófono */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <AddRegular style={{ fontSize: '24px', cursor: 'pointer', color: tokens.colorNeutralForeground3 }} />
                        <MicRegular style={{ fontSize: '24px', cursor: 'pointer', color: tokens.colorNeutralForeground3 }} />
                    </div>
                </div>
            </div>

            {/* Botones de preguntas frecuentes */}
            <div className={styles.quickActions}>
                {sampleQuestions.map((action, index) => (
                    <Button
                        key={index}
                        className={styles.actionButton}
                        icon={action.icon}
                        appearance="subtle"
                        size="small"
                        onClick={() => handleQuestionClick(action.label)}
                        style={{ backgroundColor: tokens.colorNeutralBackgroundAlpha, border: `1px solid ${tokens.colorNeutralStroke2}` }}
                    >
                        {action.label}
                    </Button>
                ))}
            </div>

            {/* Sección de solicitudes frecuentes */}
            <div style={{ width: "100%", maxWidth: "900px", marginTop: "8px" }}>
                <Text weight="semibold" size={400} style={{ marginBottom: "12px", display: "block" }}>
                    Solicitudes Frecuentes
                </Text>
                {/* Grid de tarjetas de servicios */}
                <div className={styles.servicesGrid}>
                    {serviceCategories.map((category, index) => (
                        <Card
                            key={index}
                            className={styles.activityCard}
                            onClick={() => handleServiceClick(category.title)}
                            style={{ cursor: 'pointer' }}
                        >
                            <CardHeader
                                image={<Avatar icon={category.icon} color="brand" size={40} />}
                                header={<Text weight="semibold" size={300}>{category.title}</Text>}
                                description={<Text size={200}>Gestionar {category.title.toLowerCase()}</Text>}
                            />
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardComponent;
