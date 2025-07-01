import { useState, useEffect, useCallback } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { ethers } from 'ethers'

import USDTTokenJSON from 'abis/USDTToken.json'
import QTokenJSON from 'abis/QToken.json'
import { USDT_ADDRESS, Q_ADDRESS, OPENQQUANTIFY_ADDRESS } from 'constants'

export const useBalances = () => {
    const [balancesData, setBalancesData] = useState({
        qBalance: 0,
        qAllowance: 0,
        usdtBalance: 0,
        usdtAllowance: 0
    })

    const { address, isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    const fetchBalancesData = useCallback(async () => {
        if (!isConnected) return;
        try {
            const ethersProvider = new ethers.BrowserProvider(walletProvider)
            const signer = await ethersProvider.getSigner()

            const qContract = new ethers.Contract(Q_ADDRESS, QTokenJSON, signer);
            const usdtContract = new ethers.Contract(USDT_ADDRESS, USDTTokenJSON, signer);

            const [newQBalance, newQAllowance, newUsdtBalance, newUsdtAllowance] = await Promise.all([
                qContract.balanceOf(address),
                qContract.allowance(address, OPENQQUANTIFY_ADDRESS),
                usdtContract.balanceOf(address),
                usdtContract.allowance(address, OPENQQUANTIFY_ADDRESS)
            ]);

            // Compare with current state to avoid unnecessary updates
            if (newQBalance.toString() !== balancesData.qBalance.toString() ||
                newQAllowance.toString() !== balancesData.qAllowance.toString() ||
                newUsdtBalance.toString() !== balancesData.usdtBalance.toString() ||
                newUsdtAllowance.toString() !== balancesData.usdtAllowance.toString()) {
                setBalancesData({
                    qBalance: newQBalance,
                    qAllowance: newQAllowance,
                    usdtBalance: newUsdtBalance,
                    usdtAllowance: newUsdtAllowance
                });
            }
        }
        catch (err) {
            console.log(err)
        }
    }, [isConnected, address, walletProvider, balancesData]);

    useEffect(() => {
        if (!isConnected) return;

        const intervalId = setInterval(fetchBalancesData, 2000);

        return () => clearInterval(intervalId);
    }, [fetchBalancesData, isConnected]);

    return { balancesData, fetchBalancesData };
}