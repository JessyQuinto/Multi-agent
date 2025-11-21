import { PlanChatProps } from "@/models";
import { Button } from "@fluentui/react-components";
import {
    MicRegular,
    AddRegular,
    ChevronDownRegular
} from "@fluentui/react-icons";
import { useCopilotStyles } from "../../styles/CopilotStyles";

interface SimplifiedPlanChatProps extends PlanChatProps {
    planData: any;
    input: string;
    setInput: (input: string) => void;
    submittingChatDisableInput: boolean;
    OnChatSubmit: (input: string) => void;
    waitingForPlan: boolean;
}

const PlanChatBody: React.FC<SimplifiedPlanChatProps> = ({
    planData,
    input,
    setInput,
    submittingChatDisableInput,
    OnChatSubmit,
    waitingForPlan
}) => {
    const styles = useCopilotStyles();

    return (
        <div className={styles.inputContainer}>
            <div className={styles.inputCard}>
                <textarea
                    className={styles.inputField}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            OnChatSubmit(input);
                        }
                    }}
                    disabled={submittingChatDisableInput}
                    placeholder="Describe tu solicitud o pregunta..."
                    rows={3}
                />

                <div className={styles.inputToolbar}>
                    <div className={styles.toolbarLeft}>
                        <Button
                            icon={<AddRegular />}
                            appearance="subtle"
                            className={styles.iconButton}
                            shape="circular"
                        />
                    </div>

                    <Button
                        appearance="subtle"
                        className={styles.iconButton}
                        onClick={() => { }} // Mic functionality placeholder
                        icon={<MicRegular />}
                    />
                </div>
            </div>
        </div>
    );
}

export default PlanChatBody;