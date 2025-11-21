import React from 'react';
import { TeamConfig } from '../../models';

interface PlanPanelLeftProps {
    reloadTasks: boolean;
    onNewTaskButton: () => void;
    restReload: () => void;
    onTeamSelect: (team: TeamConfig) => void;
    onTeamUpload: () => Promise<void>;
    isHomePage: boolean;
    selectedTeam: TeamConfig | null;
    onNavigationWithAlert: (callback: () => void) => void;
}

const PlanPanelLeft: React.FC<PlanPanelLeftProps> = () => {
    return <div>PlanPanelLeft Placeholder</div>;
};

export default PlanPanelLeft;
