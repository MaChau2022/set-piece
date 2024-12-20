import { Model } from '@/set-piece';
import React, { createContext, useEffect, useState } from 'react';
import { TargetCollectorInfo, TargetCollector } from '../types/collector';

export type GameContextInfo = {
    handleTargetCollect: (target: Model) => void;
    isTargetCollectable: (target: Model) => boolean;
    setTargetCollectorInfo: (info: TargetCollectorInfo) => void;
    targetCollector?: TargetCollector;
};

const GameContext = createContext<GameContextInfo | undefined>(undefined);

export const GameProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [ 
        targetCollectorInfo, 
        setTargetCollectorInfo 
    ] = useState<TargetCollectorInfo>();

    useEffect(() => {
        if (targetCollectorInfo) {
            if (targetCollectorInfo.index === targetCollectorInfo.list.length) {
                setTargetCollectorInfo(undefined);
                targetCollectorInfo.runner(targetCollectorInfo.list);
            }
        }
    }, [ targetCollectorInfo ]);

    const handleTargetCollect = (target: Model) => {
        setTargetCollectorInfo(prev => {
            if (!prev) return;
            const next = { ...prev };
            const curCollector = next.list[next.index];
            if (curCollector.candidateList?.includes(target)) {
                curCollector.result = target;
            }
            next.index++;
            return next;
        });
    };

    const targetCollector = targetCollectorInfo?.list[targetCollectorInfo?.index];
    const isTargetCollectable = (target: Model) => {
        if (!targetCollectorInfo) return false;
        if (!targetCollector) return false;
        if (targetCollector.candidateList?.includes(target)) {
            return true;
        }
        return false;
    };

    return (
        <GameContext.Provider value={{
            handleTargetCollect,
            isTargetCollectable,
            setTargetCollectorInfo,
            targetCollector
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useContext = () => {
    const context = React.useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGameContext must be used within a GameProvider');
    }
    return context;
}; 