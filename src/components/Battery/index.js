import React from 'react'
import './index.scss'

import OpenQQuantifyImg from 'assets/image/altilium.svg'

export const Battery = ({ charge }) => {
    return (
        <div className='battery'>
            <img className='altilium' src={OpenQQuantifyImg} alt="Altilium"></img>
            <div className='charge' style={{ height: `${charge}%`, position: 'absolute', width: '90%', bottom: 0, backgroundColor: `rgba(20, 241, 149, 0.8)` }}></div>
        </div>
    )
}