import { useState, useCallback } from 'react';
import { useGetWritingFeedback, useSendFollowUp } from '@workspace/api-client-react';
import type { ChatMessage } from '@workspace/api-client-react/src/generated/api.schemas';
import { MEMBERS, type Member } from '@/lib/members';

export type Thread = ChatMessage[];

export function useWritingSession() {
  const [step, setStep] = useState<'setup' | 'session'>('setup');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [writingText, setWritingText] = useState('');
  
  // State per member
  const [threads, setThreads] = useState<Record<string, Thread>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const feedbackMutation = useGetWritingFeedback();
  const followupMutation = useSendFollowUp();

  const toggleMember = useCallback((id: string) => {
    setSelectedMemberIds(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  }, []);

  const startSession = useCallback(() => {
    if (selectedMemberIds.length > 0) {
      setStep('session');
    }
  }, [selectedMemberIds]);

  const resetSession = useCallback(() => {
    setStep('setup');
    setWritingText('');
    setThreads({});
    setLoadingStates({});
    setHasSubmitted(false);
  }, []);

  const submitWriting = useCallback(async () => {
    if (!writingText.trim() || selectedMemberIds.length === 0) return;
    
    setHasSubmitted(true);
    setThreads({});
    
    // Initialize loading states for all selected members
    const initialLoadingStates: Record<string, boolean> = {};
    selectedMemberIds.forEach(id => { initialLoadingStates[id] = true; });
    setLoadingStates(initialLoadingStates);

    const activeMembers = MEMBERS.filter(m => selectedMemberIds.includes(m.id));

    // Fire off all requests in parallel without awaiting the group
    activeMembers.forEach(async (member) => {
      try {
        const res = await feedbackMutation.mutateAsync({
          data: {
            memberId: member.id,
            memberPersonality: member.personality,
            writingText: writingText
          }
        });
        
        setThreads(prev => ({
          ...prev,
          [member.id]: [{ role: 'assistant', content: res.reply }]
        }));
      } catch (err) {
        console.error(`Failed to get feedback from ${member.name}:`, err);
        setThreads(prev => ({
          ...prev,
          [member.id]: [{ role: 'assistant', content: "I'm having trouble reading this right now. Could we try again later?" }]
        }));
      } finally {
        setLoadingStates(prev => ({ ...prev, [member.id]: false }));
      }
    });
  }, [writingText, selectedMemberIds, feedbackMutation]);

  const sendFollowup = useCallback(async (member: Member, text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    const currentThread = threads[member.id] || [];
    const newThread = [...currentThread, userMsg];

    // Optimistically add user message
    setThreads(prev => ({ ...prev, [member.id]: newThread }));
    setLoadingStates(prev => ({ ...prev, [member.id]: true }));

    try {
      const res = await followupMutation.mutateAsync({
        data: {
          memberId: member.id,
          memberPersonality: member.personality,
          writingText,
          history: newThread
        }
      });
      
      setThreads(prev => ({
        ...prev,
        [member.id]: [...newThread, { role: 'assistant', content: res.reply }]
      }));
    } catch (err) {
      console.error(`Failed to send followup to ${member.name}:`, err);
      // Remove the optimistic message on failure or show error inline (simplified here)
    } finally {
      setLoadingStates(prev => ({ ...prev, [member.id]: false }));
    }
  }, [threads, writingText, followupMutation]);

  return {
    step,
    selectedMemberIds,
    writingText,
    threads,
    loadingStates,
    hasSubmitted,
    isGlobalLoading: Object.values(loadingStates).some(Boolean),
    setWritingText,
    toggleMember,
    startSession,
    resetSession,
    submitWriting,
    sendFollowup
  };
}
