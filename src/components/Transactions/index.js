import React from 'react'
import { formatUnits } from 'ethers'

import { transactionHeader } from 'data'
import { useTransactionsData } from 'hooks/useTransactions'

import { formatTimestamp, formatAddress } from 'utils'
import { Q_DECIMALS, USDT_DECIMALS } from 'constants'
import './index.scss'

const Transactions = () => {
    const transactionsData = useTransactionsData();

    const transactions = transactionsData.transactions.map((transaction, index) => {
        const user = transaction.buyer;
        const qAmount = Number(formatUnits(transaction.tokenAmount, Q_DECIMALS)).toLocaleString()
        const usdtAmount = Number(formatUnits(transaction.usdtAmount, USDT_DECIMALS)).toLocaleString()
        const date = formatTimestamp(Number(transaction.timestamp));

        return { user, qAmount, usdtAmount, date }
    })
    return (
        <div className='transactions-container'>
            <div className='card-container'>
                <div className='card-title-wrapper'>
                    <div className='card-title'>
                        Recent Transactions
                    </div>
                    {/* <div className='transaction-count'>
                        { statisticsData.transactionCount }
                    </div> */}
                </div>
                <div className='transaction-grid-container'>
                    <div className='grid'>
                        {transactionHeader.map((headerText, index) => (
                            <span className='header-cell' key={index}><strong>{headerText}</strong></span>
                        ))}
                        {
                            transactions.reverse().map((rowData, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <span className='cell user' key={`a-${index}`}>{formatAddress(rowData.user)}</span>
                                        <span className='cell q' key={`b-${index}`}>{rowData.qAmount}</span>
                                        <span className='cell usdt' key={`c-${index}`}>{rowData.usdtAmount}</span>
                                        <span className='cell date' key={`d-${index}`}>{rowData.date}</span>
                                    </React.Fragment>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Transactions