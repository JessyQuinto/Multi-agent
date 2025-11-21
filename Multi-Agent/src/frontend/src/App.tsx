import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FluentProvider } from '@fluentui/react-components';
import { HomePage, PlanPage } from './pages';
import { useWebSocket } from './hooks/useWebSocket';
import azureLightTheme from './styles/CustomTheme';

function App() {
  const { isConnected, isConnecting, error } = useWebSocket();

  return (
    <FluentProvider theme={azureLightTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/plan/:planId" element={<PlanPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </FluentProvider>
  );
}

export default App;