import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { ethers } from 'ethers'

import USDTTokenJSON from 'abis/USDTToken.json'
import OpenQQuantifyPresaleJSON from 'abis/OpenQQuantifyPresale.json'
import { OPENQQUANTIFY_ADDRESS, USDT_ADDRESS } from 'constants'

export const useActions = () => {
    const { isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    const approveToken = async (amount) => {
        if (!isConnected) return;

        try {
            const ethersProvider = new ethers.BrowserProvider(walletProvider)
            const signer = await ethersProvider.getSigner()

            const usdtContract = new ethers.Contract(USDT_ADDRESS, USDTTokenJSON, signer);
            const tx = await usdtContract.approve(OPENQQUANTIFY_ADDRESS, amount);
            await tx.wait();

            return { success: true, message: "USDT Token Approved Successfully!" }
        }
        catch (err) {
            console.log(err)
            return { success: false, message: err.reason }
        }
    };

    const purchaseQ = async (amount) => {
        if (!isConnected) return;

        try {
            const ethersProvider = new ethers.BrowserProvider(walletProvider)
            const signer = await ethersProvider.getSigner()

            const openqquantifyContract = new ethers.Contract(OPENQQUANTIFY_ADDRESS, OpenQQuantifyPresaleJSON, signer);
            const estimatedGas = await openqquantifyContract.purchaseTokenInUSDT.estimateGas(amount);
            console.log(estimatedGas);
            const tx = await openqquantifyContract.purchaseTokenInUSDT(amount, { gasLimit: estimatedGas });
            await tx.wait();

            return { success: true, message: "Q Purchase successfully!" };
        }
        catch (err) {
            return { success: false, message: err.reason }
        }
    }

    const withdrawQ = async (amount) => {
        if (!isConnected) return;

        try {
            const ethersProvider = new ethers.BrowserProvider(walletProvider)
            const signer = await ethersProvider.getSigner()

            const openqquantifyContract = new ethers.Contract(OPENQQUANTIFY_ADDRESS, OpenQQuantifyPresaleJSON, signer);
            const tx = await openqquantifyContract.withdrawToken(amount);
            await tx.wait();

            return { success: true, message: "Withdraw Q successfully!" };
        }
        catch (err) {
            console.log(err)
            return { success: false, message: err.reason };
        }
    }

    return { approveToken, purchaseQ, withdrawQ };
}