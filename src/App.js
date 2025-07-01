import React from 'react'

import Portfolio from 'components/Portfolio'
import Statistics from 'components/Statistics'
import Transactions from 'components/Transactions'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import './App.scss'

const App = () => {
    return (
        <div className='app-container'>
            <div className='title'>
                OpenQQuantify Presale
            </div>
            <div className='description'>
                New Funding Project for Electronics AI. <strong>LIVE</strong>
            </div>
            <div className='content'>
                <div className='grid-container'>
                    <main>
                        <Statistics />
                        <Portfolio />
                        <Transactions />
                    </main>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default App;