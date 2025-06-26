import { createContext, useState, useContext } from 'react';

// ✅ Create the context
type CustomerContextType = {
    customer: any;
    setCustomer: React.Dispatch<React.SetStateAction<any>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    error: any;
    setError: React.Dispatch<React.SetStateAction<any>>;
    updateCustomer: (customerData: any) => void;
};

export const CustomerDataContext = createContext<CustomerContextType>({
    customer: null,
    setCustomer: () => {},
    isLoading: false,
    setIsLoading: () => {},
    error: null,
    setError: () => {},
    updateCustomer: () => {},
});

// ✅ Create the provider component
import type { PropsWithChildren } from 'react';

const CustomerContext = ({ children }: PropsWithChildren<{}>) => {
    const [customer, setCustomer] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateCustomer = (customerData: any) => {
        setCustomer(customerData);
    };

    const value = {
        customer,
        setCustomer,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateCustomer
    };

    return (
        <CustomerDataContext.Provider value={value}>
            {children}
        </CustomerDataContext.Provider>
    );
};

export default CustomerContext;
