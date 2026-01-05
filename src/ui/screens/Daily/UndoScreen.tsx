import React, { useState } from 'react';
// Verander tijdelijk de import naar een relatief pad als de alias faalt
// import { transactionService } from '../../services/transactionService'; 
import {StatefulTransactionAdapter} from '@adapters/transaction/stateful'
interface UndoScreenProps {
  initialData: any; // Tijdelijke expliciete any om TS7031 te sussen
}
import { ZodError } from 'zod';

export const UndoScreen: React.FC<UndoScreenProps> = ({ initialData }) => {
  // ADR-03: Adapter bewaart de staat, UI projecteert alleen de 'currentView'
  const [adapter] = useState(() => new StatefulTransactionAdapter(initialData));
  const [currentView, setCurrentView] = useState(adapter.getCurrentState());
  const [uiError, setUiError] = useState<string | null>(null);

  const handleUpdate = (inputValue: number, parts: number) => {
    setUiError(null);
    try {
      // ADR-05: Berekening wordt gedelegeerd, ZodError wordt gegooid bij floats
      const distribution = adapter.calculateDistribution(inputValue, parts);
      
      const newState = { ...currentView, distribution, lastUpdated: new Date().toISOString() };
      adapter.push(newState, 'USER_UPDATE');
      
      setCurrentView(adapter.getCurrentState());
    } catch (error) {
      if (error instanceof ZodError) {
        setUiError("Input violation: Integers only (ADR-05)");
      } else {
        setUiError("An unexpected error occurred");
      }
    }
  };

  const handleUndo = () => {
    const prevState = adapter.undo();
    if (prevState) setCurrentView(prevState);
  };

  const handleRedo = () => {
    const nextState = adapter.redo();
    if (nextState) setCurrentView(nextState);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Transaction Undo/Redo</h1>
      {uiError && <div className="text-red-500 mb-2">{uiError}</div>}
      
      <div className="mt-4 space-y-2">
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(currentView, null, 2)}
        </pre>
        
        <div className="flex space-x-2">
          <button onClick={handleUndo} className="px-4 py-2 bg-blue-500 text-white rounded">Undo</button>
          <button onClick={handleRedo} className="px-4 py-2 bg-blue-500 text-white rounded">Redo</button>
        </div>

        {/* Simulatie van invoer voor testdoeleinden */}
        <button 
          onClick={() => handleUpdate(100.5, 2)} 
          className="block mt-4 text-xs text-gray-400"
        >
          Test Float Violation (100.5)
        </button>
      </div>
    </div>
  );
};
