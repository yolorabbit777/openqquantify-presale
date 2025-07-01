import React, { useState, useEffect, useMemo } from 'react'
import { formatUnits, parseUnits } from 'ethers'

import { useWeb3ModalAccount, useWeb3Modal } from '@web3modal/ethers/react'

import { toast } from 'react-toastify'

import { formatAddress, formatTimeDifference } from 'utils'
import { Q_DECIMALS, USDT_DECIMALS } from 'constants'
import { useStatisticsData } from 'contexts/statistics/statisticsContext'
import { useBalances } from 'hooks/useBalances'
import { useActions } from 'hooks/useActions'
import { useCurrentTime } from 'hooks/useCurrentTime'

import { PieChart } from './PieChart'

import './index.scss'

const Purchase = ({ isLoading, setIsLoading }) => {
    const { address, isConnected } = useWeb3ModalAccount();
    const [usdtAmount, setUSDTAmount] = useState(0);
    const [qAmount, setQAmount] = useState(0);
    const [chainData, setChainData] = useState([
        ['Locked', 1],
        ['Sold', 0]
    ])
    const [approvalMessage, setApprovalMessage] = useState('');
    const { open } = useWeb3Modal();

    const { statisticsData } = useStatisticsData();
    const { balancesData } = useBalances();
    const { approveToken, purchaseQ } = useActions();
    const currentDate = useCurrentTime();

    const tokenPrice = Number(formatUnits(statisticsData.tokenPrice, USDT_DECIMALS)).toLocaleString()
    const totalQLocked = Number(formatUnits(statisticsData.totalDepositAmount - statisticsData.totalSaleAmount, Q_DECIMALS))
    const totalQSold = Number(formatUnits(statisticsData.totalSaleAmount, Q_DECIMALS))
    const usdtBalance = Number(formatUnits(balancesData.usdtBalance, USDT_DECIMALS))
    const usdtAllowance = Number(formatUnits(balancesData.usdtAllowance, USDT_DECIMALS))

    useEffect(() => {
        if (!statisticsData || (!totalQLocked && !totalQSold)) return;
        setChainData([
            ['Locked', totalQLocked],
            ['Sold', totalQSold]
        ]);
    }, [statisticsData]);

    const leftTime = useMemo(() => {
        if (!statisticsData.isActive) return null;
        const saleStartTime = Number(statisticsData.saleStartTime.toString());
        const currentTime = currentDate.getTime() / 1000;
        if (currentTime >= saleStartTime) return null;

        const timeDifference = Math.floor(saleStartTime - currentTime);

        return formatTimeDifference(timeDifference);
    }, [statisticsData.isActive, statisticsData.saleStartTime, currentDate])

    useEffect(() => {
        if (Number(usdtAmount) >= 0 && Number(tokenPrice) > 0) {
            setQAmount(Number(usdtAmount) / Number(tokenPrice));
        }
    }, [usdtAmount, tokenPrice])

    useEffect(() => {
        if ((usdtAllowance < usdtAmount) && (usdtBalance > 0)) {
            setApprovalMessage(`Approval required: Please approve your USDT to purchase Q.`);
        } else {
            setApprovalMessage('');
        }
    }, [usdtAllowance, usdtAmount]);

    const onApprove = async () => {
        setIsLoading(true)
        if (usdtAllowance < usdtAmount) {
            const approveStatus = await approveToken(balancesData.usdtBalance);
            if (approveStatus.success) {
                toast.success(approveStatus.message)
            } else {
                toast.error(approveStatus.message)
                setIsLoading(false)
                return;
            }
        }
        setIsLoading(false)
    }

    const onPurchase = async () => {
        setIsLoading(true)
        try {
            const status = await purchaseQ(parseUnits(parseFloat(usdtAmount).toFixed(2), USDT_DECIMALS));
            if (status.success) {
                toast.success(status.message);
            }
            else {
                toast.error(status.message);
            }
        } catch (err) {
            console.log(err)
        }
        setIsLoading(false)
    }

    const onConnect = () => {
        open();
    }

    const onChangeUSDTAmount = (e) => {
        const value = e.target.value;

        if (parseFloat(value) > usdtBalance) {
            setUSDTAmount(usdtBalance);
        } else if (parseFloat(value <= 0)) {
            setUSDTAmount(0)
        } else {
            setUSDTAmount(value);
        }
    }

    return (
        <div className='purchase-container'>
            <div className='card-title-wrapper'>
                <div className='card-title'>
                    Purchase
                </div>
                <div className='token-price'>
                    ${tokenPrice}
                </div>
            </div>
            <div className='card-content'>
                <div className='card-content-wrapper'>
                    <div className="chart-data">
                        <div className='items-data'>
                            <div className='item-address'>
                                <div className='name'>Your Address</div>
                                <div className='value'>{isConnected ? formatAddress(address) : ''}</div>
                            </div>
                            <div className='item-address'>
                                <div className='name'>Your USDT Balance</div>
                                <div className='value'>{isConnected ? `${usdtBalance.toLocaleString()} USDT` : ''}</div>
                            </div>
                            {approvalMessage && (
                                <div className="item-approval-message">
                                    <div className='approval-message'>{approvalMessage}</div>
                                </div>
                            )}
                            <div className='item-usdt'>
                                <div className='name'>Input USDT</div>
                                <div className='input-container'>
                                    {(isConnected && (!usdtBalance || usdtBalance <= 0)) ?
                                        <>
                                            <div className='input-alert'>Please add USDT to connected wallet.</div>
                                        </>
                                        :
                                        <>
                                            <input className='input-value' type="text" value={usdtAmount} onChange={onChangeUSDTAmount}></input>
                                            <div className='value'>USDT</div>
                                        </>
                                    }
                                </div>
                            </div>
                            <div className='item-q'>
                                <div className='name'>Q Amount</div>
                                <div className='value'>{qAmount.toLocaleString()} Q</div>
                            </div>
                        </div>
                        <div className='buttons-row mobile'>
                            {!statisticsData.isActive ?
                                <div className='notification'>Presale is not activated yet.</div>
                                :
                                (
                                    leftTime !== null ? <div className='notification'>Presale starts in <b>{leftTime}</b></div> :
                                        (isConnected ?
                                            (usdtBalance > 0) && <button className='btn purchase' disabled={isLoading || !usdtBalance || usdtBalance <= 0} onClick={usdtAllowance < usdtAmount ? onApprove : onPurchase}>{isLoading ? 'Loading...' :
                                                (usdtAllowance < usdtAmount ? 'Approve' : 'Purchase')}</button>
                                            :
                                            <button className='btn purchase' onClick={onConnect}>Connect Wallet</button>
                                        )
                                )
                            }
                        </div>
                        <div className='chart-wrapper'>
                            <PieChart series={chainData} height={200} />
                        </div>
                    </div>
                    <div className='buttons-row desktop'>
                        {!statisticsData.isActive ?
                            <div className='notification'>Presale is not activated yet.</div>
                            :
                            (
                                leftTime !== null ? <div className='notification'>Presale starts in <b>{leftTime}</b></div> :
                                    (isConnected ?
                                        (usdtBalance > 0) && <button className='btn purchase' disabled={isLoading || !usdtBalance || usdtBalance <= 0} onClick={usdtAllowance < usdtAmount ? onApprove : onPurchase}>{isLoading ? 'Loading...' :
                                            (usdtAllowance < usdtAmount ? 'Approve' : 'Purchase')}</button>
                                        :
                                        <button className='btn purchase' onClick={onConnect}>Connect Wallet</button>
                                    )
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Purchase