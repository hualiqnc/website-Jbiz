"use client";

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const TransactionDashboard: React.FC = () => {
    const [totalTransactions, setTotalTransactions] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${process.env.NEXT_PUBLIC_API_KEY}`;

    const fetchTotalTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            const totalTxCount = response.data.result;
            setTotalTransactions(Number(totalTxCount));
        } catch (err) {
            console.error(err); // Optional: log the error for debugging
            setError('Error fetching data from the API');
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchTotalTransactions();
        const interval = setInterval(fetchTotalTransactions, 60000); // Fetch every 60 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [fetchTotalTransactions]);

    if (loading) {
        return <div>Loading data...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex flex-col items-center p-4 ">
            <div className="bg-white shadow-md rounded-lg p-4 m-2 w-80">
                <h2 className="text-lg font-bold mb-2">Total Transactions</h2>
                <h3 className="text-2xl font-semibold">{totalTransactions}</h3>
            </div>
        </div>
    );
};

export default TransactionDashboard;
