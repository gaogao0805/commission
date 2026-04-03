import React, { createContext, useContext, useState, useCallback } from 'react';
import { candidates as initialData } from './candidates';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [candidates, setCandidates] = useState(initialData.map(c => ({ ...c })));

  const updateCandidate = useCallback((id, updates) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const getNew = useCallback(() => candidates.filter(c => c.recruiterDecision === null), [candidates]);
  const getPassed = useCallback(() => candidates.filter(c => c.recruiterDecision === 'pass'), [candidates]);
  const getPending = useCallback(() => candidates.filter(c => c.recruiterDecision === 'pending'), [candidates]);
  const getRejected = useCallback(() => candidates.filter(c => c.recruiterDecision === 'reject'), [candidates]);
  const getById = useCallback((id) => candidates.find(c => c.id === id), [candidates]);
  const getResumeUpdateCount = useCallback(() => candidates.filter(c => c.hasNewResume && !c.newResumeRead).length, [candidates]);

  return (
    <AppContext.Provider value={{
      candidates, updateCandidate,
      getNew, getPassed, getPending, getRejected, getById, getResumeUpdateCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
