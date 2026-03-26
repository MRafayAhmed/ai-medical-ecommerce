import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';

const StockContext = createContext();

export const StockProvider = ({ children }) => {
    const [stocks, setStocks] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await api.get('/medical-inventory/stocks');
                setStocks(response.data || []);
            } catch (err) {
                console.error("Failed to fetch stocks globally", err);
            }
        };
        fetchStocks();
    }, [location.pathname]); // Fetch on every page change

    const getStock = (itemId) => {
        const item = stocks.find(s => s.item_id === itemId);
        return item ? Number(item.stock) : null;
    };

    return (
        <StockContext.Provider value={{ stocks, getStock }}>
            {children}
        </StockContext.Provider>
    );
};

export const useStock = () => useContext(StockContext);
