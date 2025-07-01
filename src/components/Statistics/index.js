import React, { useState, useEffect } from 'react'
import { formatUnits } from 'ethers'
import './index.scss'

import { Q_DECIMALS, USDT_DECIMALS } from 'constants'
import { useStatisticsData } from 'contexts/statistics/statisticsContext'

const Statistics = () => {
    const { statisticsData, totalUsers: statsTotalUsers } = useStatisticsData();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [previousIndex, setPreviousIndex] = useState(null);

    const totalUSDTLocked = Number(formatUnits(statisticsData.totalUSDTLocked, USDT_DECIMALS)).toLocaleString()
    const totalQLocked = Number(formatUnits(statisticsData.totalDepositAmount - statisticsData.totalSaleAmount, Q_DECIMALS)).toLocaleString()
    const totalUsers = Number(statsTotalUsers).toLocaleString()
    const tokenPrice = Number(formatUnits(statisticsData.tokenPrice, USDT_DECIMALS)).toLocaleString()

    const cards = [
        {
            title: 'TVL',
            value: `$${totalUSDTLocked}`,
            className: ''
        },
        {
            title: (
                <>
                    Q Balance on <span className='contract-name'>Presale</span>
                </>
            ),
            value: (
                <>
                    {totalQLocked} <div className="currency_type">Q</div>
                </>
            ),
            className: 'green'
        },
        {
            title: 'Total Users',
            value: `${totalUsers}`,
            className: ''
        },
        {
            title: 'Q Token Price',
            value: `$${tokenPrice}`,
            className: 'green'
        }
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setPreviousIndex(currentIndex);
            setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex, cards.length]);

    return (
        <div className='statistics-container'>
            <div className='statistics-slider'>
                {previousIndex !== null && (
                    <div className={`overview-card ${cards[previousIndex].className} slide-out`} key={`prev-${cards[previousIndex].title}`}>
                        <div className='card-title'>{cards[previousIndex].title}</div>
                        <div className='card-value'>{cards[previousIndex].value}</div>
                    </div>
                )}
                <div className={`overview-card ${cards[currentIndex].className} slide-in`} key={cards[currentIndex].title}>
                    <div className='card-title'>{cards[currentIndex].title}</div>
                    <div className='card-value'>{cards[currentIndex].value}</div>
                </div>
            </div>

            <div className="statistics-grid">
                {cards.map((card, index) => (
                    <div className={`overview-card ${card.className}`} key={index}>
                        <div className='card-title'>{card.title}</div>
                        <div className='card-value'>{card.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Statistics