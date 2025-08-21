"use client"

import { createContext, useContext, ReactNode } from "react";

// Context for sharing event details between components
export interface EventDetails {
    id: string;
    name: string;
    description: string;
    category: string;
    image: string;
    basePrice: number;
}

interface EventContextType {
    eventDetails: Map<string, EventDetails>;
    setEventDetails: (id: string, details: EventDetails) => void;
    removeEventDetails: (id: string) => void;
}

export const EventContext = createContext<EventContextType | null>(null);

export const useEventContext = () => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('useEventContext must be used within EventProvider');
    }
    return context;
};

interface EventProviderProps {
    children: ReactNode;
    value: EventContextType;
}

export const EventProvider = ({ children, value }: EventProviderProps) => {
    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    );
};
