import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalContextProps {
  selectedService: string;
  setSelectedService: React.Dispatch<React.SetStateAction<string>>;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [selectedService, setSelectedService] = useState<string>('OpenAI');

  return (
    <GlobalContext.Provider value={{ selectedService, setSelectedService }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
