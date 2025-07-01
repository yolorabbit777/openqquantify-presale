import { useState, useEffect, useCallback } from 'react'
import { useQuery, gql } from '@apollo/client'

const TOTAL_TRANSACTIONS_QUERY = gql`
    {
        transactions_collection {
            buyer
            usdtAmount
            tokenAmount
            timestamp
        }
    }
`

export const useTransactionsData = () => {
    const [transactionsData, setTransactionsData] = useState({
        transactionCount: 0,
        transactions: []
    })

    const { data } = useQuery(TOTAL_TRANSACTIONS_QUERY, {
        pollInterval: 1000,
    });

    const fetchTransactionsData = useCallback(() => {
        try {

            let transactionCount = data? data.transactions_collection.length : 0;
            let transactions  = data? [...data.transactions_collection]: [];

            transactions = transactions.sort((a, b) => a.timestamp - b.timestamp);
            transactions = transactions.slice(0, 10);
            setTransactionsData({...transactionsData, transactions: transactions, transactionCount: transactionCount })
        }
        catch (err) {
            console.log(err)
        }
    }, [data]);

    useEffect(() => {
       fetchTransactionsData()
    }, [fetchTransactionsData]);

    return transactionsData;
}