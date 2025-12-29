import { useState, useEffect } from 'react';

export const useAppOrchestration = (loadState: any) => {
  const [status, setStatus] = useState<'HYDRATING' | 'UNBOARDING' | 'READY' | 'ERROR'>('HYDRATING');

  useEffect(() => {
    if (loadState === undefined) return; // Wacht op data

    try {
      if (loadState === null) {
        setStatus('UNBOARDING');
      } else if (loadState?.version === '1.0') {
        setStatus('READY');
      } else {
        setStatus('ERROR');
      }
    } catch (e) {
      setStatus('ERROR');
    }
  }, [loadState]);

  return { status };
};