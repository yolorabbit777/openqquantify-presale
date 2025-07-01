import React, { useState } from 'react'

import MyPortfolio from './MyPortfolio'
import Purchase from './Purchase'

import './index.scss'
import { LoadingOverlay } from 'components/LoadingOverlay'

const Portfolio = () => {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <div className='portfolio-container'>
            <div className='card-container my-portfolio'>
                <MyPortfolio isLoading={isLoading} setIsLoading={setIsLoading}/>
            </div>
            <div className='card-container purchase'>
                <Purchase isLoading={isLoading} setIsLoading={setIsLoading}/>
            </div>
            <LoadingOverlay isLoading={isLoading}/>
        </div>
    )
}

export default Portfolio