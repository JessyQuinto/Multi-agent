import React from 'react';
import { ProcessedPlanData, MPlanData } from '../../models';

interface PlanPanelRightProps {
    planData: ProcessedPlanData | null;
    loading: boolean;
    planApprovalRequest: MPlanData | null;
}

const PlanPanelRight: React.FC<PlanPanelRightProps> = () => {
    return <div>PlanPanelRight Placeholder</div>;
};

export default PlanPanelRight;
