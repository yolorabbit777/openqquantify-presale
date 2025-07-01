import { createContext, useEffect, useContext, useCallback, useState } from 'react'

import { ethers } from 'ethers'

import OpenQQuantifyPresaleJSON from 'abis/OpenQQuantifyPresale.json'

import { NETWORK } from 'config'
import { OPENQQUANTIFY_ADDRESS } from 'constants'
import { getProvider } from 'constants/provider'

import { useQuery, gql } from '@apollo/client'

const TOTAL_USERS_QUERY = gql`
    {
        presales {
            totalUsers
        }
    }
`

export const statisticsContext = createContext({})

export const StatisticsProvider = ({ children }) => {
    const [statisticsData, setStatisticsData] = useState({
        totalDepositAmount: 0,
        totalUSDTLocked: 0,
        totalSaleAmount: 0,
        tokenPrice: 0,
        isActive: true,
        isSaleEnd: false,
        lockPeriod: 0,
        saleStartTime: 0,
        saleEndTime: 0
    });
    const [totalUsers, setTotalUsers] = useState(0);

    const { data } = useQuery(TOTAL_USERS_QUERY, {
        pollInterval: 1000,
    });

    const fetchUsers = useCallback(() => {
        let totalUsers = data && data.presales.length ? data.presales[0].totalUsers : 0;
        setTotalUsers(totalUsers);
    }, [data])

    const fetchStatisticsData = useCallback(async () => {
        try {
            const provider = getProvider(NETWORK);
            const openqquantifyContract = new ethers.Contract(OPENQQUANTIFY_ADDRESS, OpenQQuantifyPresaleJSON, provider);

            const [newTotalDepositAmount, newTotalUSDTLocked, newTotalSaleAmount, newTokenPrice, newIsActive, newIsSaleEnd, newLockPeriod, newSaleStartTime, newSaleEndTime] = await Promise.all([
                openqquantifyContract.totalDepositAmount(),
                openqquantifyContract.totalUSDTLocked(),
                openqquantifyContract.totalSaleAmount(),
                openqquantifyContract.tokenPrice(),
                openqquantifyContract.isActive(),
                openqquantifyContract.isSaleEnd(),
                openqquantifyContract.lockPeriod(),
                openqquantifyContract.startTimestamp(),
                openqquantifyContract.saleEndTime()
            ]);

            if (newTotalDepositAmount.toString() !== statisticsData.totalDepositAmount.toString() ||
                newTotalUSDTLocked.toString() !== statisticsData.totalUSDTLocked.toString() ||
                newTotalSaleAmount.toString() !== statisticsData.totalSaleAmount.toString() ||
                newTokenPrice.toString() !== statisticsData.tokenPrice.toString() ||
                newIsActive.toString() !== statisticsData.isActive.toString() ||
                newIsSaleEnd.toString() !== statisticsData.isSaleEnd.toString() ||
                newLockPeriod.toString() !== statisticsData.lockPeriod.toString() ||
                newSaleStartTime.toString() !== statisticsData.saleStartTime.toString() ||
                newSaleEndTime.toString() !== statisticsData.saleEndTime.toString()) {
                setStatisticsData({
                    ...statisticsData, totalDepositAmount: newTotalDepositAmount, totalUSDTLocked: newTotalUSDTLocked,
                    totalSaleAmount: newTotalSaleAmount, tokenPrice: newTokenPrice, isActive: newIsActive, isSaleEnd: newIsSaleEnd,
                    lockPeriod: newLockPeriod, saleStartTime: newSaleStartTime, saleEndTime: newSaleEndTime
                })
            }
        }
        catch (err) {
            console.log(err);
        }
    }, []);

    useEffect(() => {
        const intervalId = setInterval(fetchStatisticsData, 2000);

        return () => clearInterval(intervalId);
    }, [fetchStatisticsData]);

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    return <statisticsContext.Provider value={{ statisticsData, totalUsers }}>{children}</statisticsContext.Provider>
}

export const useStatisticsData = () => {
    const context = useContext(statisticsContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}