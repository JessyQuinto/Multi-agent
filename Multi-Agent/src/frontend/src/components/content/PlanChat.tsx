import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Button,
  Body1,
  Spinner,
  Tag,
  Textarea,
  Avatar,
} from "@fluentui/react-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  CheckmarkRegular,
  DismissRegular,
  SendRegular,
  PersonRegular,
  BotRegular,
} from "@fluentui/react-icons";
import { PlanChatProps, MPlanData } from "../../models/plan";
import webSocketService from "../../services/WebSocketService";
import { PlanDataService } from "../../services/PlanDataService";
import { apiService } from "../../api/apiService";
import { useNavigate } from "react-router-dom";
import ChatInput from "../../coral/modules/ChatInput";
import InlineToaster, {
  useInlineToaster,
} from "../toast/InlineToaster";
import { AgentMessageData, WebsocketMessageType } from "@/models";
import getUserPlan from "./streaming/StreamingUserPlan";
import renderUserPlanMessage from "./streaming/StreamingUserPlanMessage";
import renderPlanResponse from "./streaming/StreamingPlanResponse";
import { renderPlanExecutionMessage, renderThinkingState } from "./streaming/StreamingPlanState";
import ContentNotFound from "../NotFound/ContentNotFound";
import PlanChatBody from "./PlanChatBody";
import renderAgentMessages from "./streaming/StreamingAgentMessage";
import StreamingBufferMessage from "./streaming/StreamingBufferMessage";
import { useCopilotStyles } from "../../styles/CopilotStyles";

interface SimplifiedPlanChatProps extends PlanChatProps {
  onPlanReceived?: (planData: MPlanData) => void;
  initialTask?: string;
  planApprovalRequest: MPlanData | null;
  waitingForPlan: boolean;
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  streamingMessageBuffer: string;
  showBufferingText: boolean;
  agentMessages: AgentMessageData[];
  showProcessingPlanSpinner: boolean;
  showApprovalButtons: boolean;
  handleApprovePlan: () => Promise<void>;
  handleRejectPlan: () => Promise<void>;
  processingApproval: boolean;

}

const PlanChat: React.FC<SimplifiedPlanChatProps> = ({
  planData,
  input,
  setInput,
  submittingChatDisableInput,
  OnChatSubmit,
  onPlanApproval,
  onPlanReceived,
  initialTask,
  planApprovalRequest,
  waitingForPlan,
  messagesContainerRef,
  streamingMessageBuffer,
  showBufferingText,
  agentMessages,
  showProcessingPlanSpinner,
  showApprovalButtons,
  handleApprovePlan,
  handleRejectPlan,
  processingApproval
}) => {
  const styles = useCopilotStyles();
  const hasMessages = agentMessages.length > 0 || planApprovalRequest;

  if (!planData)
    return (
      <ContentNotFound subtitle="The requested page could not be found." />
    );
  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        {/* Icons from screenshot: Edit, More, Mute, Close */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button icon={<DismissRegular />} appearance="subtle" />
        </div>
      </div>

      <InlineToaster />

      <div
        ref={messagesContainerRef}
        className={styles.messagesArea}
      >
        {!hasMessages ? (
          <div className={styles.greetingContainer}>
            <div className={styles.greetingText}>
              Hola JESSY, ¿en qué puedo ayudarte con tus solicitudes de RRHH hoy?
            </div>

            <div className={styles.suggestionContainer}>
              <button className={styles.suggestionChip} onClick={() => setInput("Explícame la política de vacaciones")}>
                Explícame la política de vacaciones
              </button>
              <button className={styles.suggestionChip} onClick={() => setInput("¿Cómo solicito un certificado laboral?")}>
                ¿Cómo solicito un certificado laboral?
              </button>
              <button className={styles.suggestionChip} onClick={() => setInput("¿Cuándo es el próximo pago de nómina?")}>
                ¿Cuándo es el próximo pago de nómina?
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* User plan message */}
            {renderUserPlanMessage(planApprovalRequest, initialTask, planData)}

            {/* AI thinking state */}
            {renderThinkingState(waitingForPlan)}

            {/* Plan response with all information */}
            {renderPlanResponse(planApprovalRequest, handleApprovePlan, handleRejectPlan, processingApproval, showApprovalButtons)}
            {renderAgentMessages(agentMessages)}

            {showProcessingPlanSpinner && renderPlanExecutionMessage()}
            {/* Streaming plan updates */}
            {showBufferingText && (
              <StreamingBufferMessage
                streamingMessageBuffer={streamingMessageBuffer}
                isStreaming={true}
              />
            )}
          </>
        )}
      </div>

      {/* Chat Input */}
      <PlanChatBody
        planData={planData}
        input={input}
        setInput={setInput}
        submittingChatDisableInput={submittingChatDisableInput}
        OnChatSubmit={OnChatSubmit}
        waitingForPlan={waitingForPlan}
        loading={false} />

    </div>
  );
};

export default PlanChat;