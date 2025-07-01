import { useState, useEffect, useCallback } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { ethers } from 'ethers'

import OpenQQuantifyPresaleJSON from 'abis/OpenQQuantifyPresale.json'
import { OPENQQUANTIFY_ADDRESS } from 'constants'

import { useQuery, gql } from '@apollo/client'

const USER_TRANSACTIONS_QUERY = gql`
    query GetUserTransaction($buyerId: Bytes!){
        transactions_collection(where: { buyer: $buyerId }) {
            buyer
            usdtAmount
            tokenAmount
            timestamp
        }
    }
`

export const usePortfolioData = () => {
    const [portfolioData, setPortfolioData] = useState({
        totalQPurchased: 0,
        totalUSDTAmount: 0,
        availableQAmount: 0
    })
    const [investments, setInvestments] = useState([]);

    const { address, isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    const { data } = useQuery(USER_TRANSACTIONS_QUERY, {
        variables: { buyerId: address ? address : ethers.ZeroAddress },
        pollInterval: 1000,
    });

    const fetchInvestments = useCallback(() => {
        if (!isConnected) return;
        console.log(data);
        let transactions = data ? [...data.transactions_collection] : [];

        transactions = transactions.sort((a, b) => a.timestamp - b.timestamp);
        let cumulatedUsdt = 0;
        const investments = transactions.map((tx) => {
            cumulatedUsdt += Number(tx.usdtAmount) / 1000000;
            return [
                Number(tx.timestamp) * 1000,
                cumulatedUsdt
            ]
        })
        setInvestments(investments);
    }, [isConnected, data])

    const fetchPortfolioData = useCallback(async () => {
        if (!isConnected) return;

        try {
            const ethersProvider = new ethers.BrowserProvider(walletProvider)
            const signer = await ethersProvider.getSigner()

            const openqquantifyContract = new ethers.Contract(OPENQQUANTIFY_ADDRESS, OpenQQuantifyPresaleJSON, signer);


            let buyerInfo = await openqquantifyContract.buyerInfo(address);

            if (portfolioData.totalQPurchased.toString() !== buyerInfo.totalPurchasedAmount.toString() ||
                portfolioData.totalUSDTAmount.toString() !== buyerInfo.totalUSDTAmount.toString() ||
                portfolioData.availableQAmount.toString() !== buyerInfo.amount.toString()) {
                setPortfolioData({ ...portfolioData, totalQPurchased: buyerInfo.totalPurchasedAmount, totalUSDTAmount: buyerInfo.amountInUSDT, availableQAmount: buyerInfo.amount });
            }
        }
        catch (err) {
            console.log(err)
        }
    }, [isConnected, address, walletProvider, data]);

    useEffect(() => {
        if (!isConnected) return;

        const intervalId = setInterval(fetchPortfolioData, 2000);

        return () => clearInterval(intervalId);
    }, [fetchPortfolioData, isConnected]);

    useEffect(() => {
        fetchInvestments();
    }, [fetchInvestments])

    return { portfolioData, investments };
}