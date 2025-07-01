import React, { useMemo } from 'react'
import { useWeb3ModalAccount } from '@web3modal/ethers/react'
import { formatUnits } from 'ethers'

import { toast } from 'react-toastify'

import { formatTimeDifference } from 'utils'
import { useStatisticsData } from 'contexts/statistics/statisticsContext'
import { usePortfolioData } from 'hooks/usePortfolioData'
import { useActions } from 'hooks/useActions'
import { useCurrentTime } from 'hooks/useCurrentTime'

import { SymbolChart } from './SymbolChart'

import { Q_DECIMALS, USDT_DECIMALS } from 'constants'
import './index.scss'

const MyPortfolio = ({ isLoading, setIsLoading }) => {
    const { isConnected } = useWeb3ModalAccount();
    const { portfolioData, investments } = usePortfolioData();
    const { withdrawQ } = useActions();

    const { statisticsData } = useStatisticsData();
    const currentDate = useCurrentTime();

    const totalUSDTAmount = Number(formatUnits(portfolioData.totalUSDTAmount, USDT_DECIMALS)).toLocaleString()
    const totalQPurchased = Number(formatUnits(portfolioData.totalQPurchased, Q_DECIMALS)).toLocaleString()
    const availableQAmount = Number(formatUnits(portfolioData.availableQAmount, Q_DECIMALS)).toLocaleString()

    const leftTime = useMemo(() => {
        if (!statisticsData.isSaleEnd) return null;

        const lockTimeStamp = Number((statisticsData.saleEndTime + statisticsData.lockPeriod).toString());
        const currentTime = currentDate.getTime() / 1000;
        if (currentTime >= lockTimeStamp) return null;

        const timeDifference = Math.floor(lockTimeStamp - currentTime);

        return formatTimeDifference(timeDifference);
    }, [statisticsData.isSaleEnd, statisticsData.saleEndTime, statisticsData.lockPeriod, currentDate])

    const onWithdraw = async () => {
        setIsLoading(true);
        try {
            const status = await withdrawQ(portfolioData.availableQAmount);
            if (status.success) {
                toast.success(status.message);
            }
            else {
                toast.error(status.message);
            }
        }
        catch (err) {
            console.log(err)
        }
        setIsLoading(false);
    }

    return (
        <div className='myportfolio-container'>
            <div className='card-title-wrapper'>
                <div className='card-title'>
                    My Portfolio
                </div>
                <div className='my-deposit'>
                    ${totalUSDTAmount}
                </div>
            </div>
            <div className='card-content'>
                <div className='card-content-wrapper'>
                    <div className="chart-data">
                        <div className='items-data'>
                            <div className='item-q'>
                                <div className='name'>Total Q Purchased</div>
                                <div className='value'>{totalQPurchased} Q</div>
                            </div>
                            <div className='item-usdt'>
                                <div className='name'>Total USDT Invested</div>
                                <div className='value'>{totalUSDTAmount} USDT</div>
                            </div>
                            <div className='item-available-q'>
                                <div className='name'>Available Q amount</div>
                                <div className='value'>{availableQAmount} Q</div>
                            </div>
                        </div>
                        <div className='buttons-row mobile'>
                            {!statisticsData.isSaleEnd ?
                                <div className='notification'>You can withdraw Q after Sale Ends.</div>
                                :
                                (
                                    leftTime !== null ? <div className='notification'>You will be able to withdraw in <b>{leftTime}</b></div> :
                                        (isConnected && <button className='btn withdraw' disabled={isLoading} onClick={onWithdraw}>{isLoading ? 'Loading...' : 'Withdraw'}</button>)
                                )
                            }
                        </div>
                        <div className='chart-wrapper'>
                            <SymbolChart series={investments} height={200} />
                        </div>
                    </div>

                    <div className='buttons-row desktop'>
                        {!statisticsData.isSaleEnd ?
                            <div className='notification'>You can withdraw Q after Sale Ends.</div>
                            :
                            (
                                leftTime !== null ? <div className='notification'>You will be able to withdraw in <b>{leftTime}</b></div> :
                                    (isConnected && <button className='btn withdraw' disabled={isLoading} onClick={onWithdraw}>{isLoading ? 'Loading...' : 'Withdraw'}</button>)
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyPortfolio