import React, { createContext, useContext, useState, FC, ReactNode } from 'react';
import { IDoctor } from "../../intefaces/doctorInterfaces";
import doctorsData from '../../data.json';

const flattenedDoctorsData: IDoctor[] = doctorsData.flat();

interface DoctorsContextProps {
    doctors: IDoctor[];
    setDoctors: React.Dispatch<React.SetStateAction<IDoctor[]>>;
    filters: { price: number; rating: number; country: string };
    setFilters: React.Dispatch<React.SetStateAction<{ price: number; rating: number; country: string }>>;
}

const DoctorsContext = createContext<DoctorsContextProps | undefined>(undefined);

export const useDoctors = () => {
    const context = useContext(DoctorsContext);
    if (!context) {
        throw new Error('useDoctors must be used within a DoctorsProvider');
    }
    return context;
};

export const DoctorsProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [doctors, setDoctors] = useState<IDoctor[]>(flattenedDoctorsData);
    const [filters, setFilters] = useState<{ price: number; rating: number; country: string }>({ price: 0, rating: 0, country: '' });

    return (
        <DoctorsContext.Provider value={{ doctors, setDoctors, filters, setFilters }}>
            {children}
        </DoctorsContext.Provider>
    );
};