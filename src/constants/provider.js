import { ethers } from 'ethers'

import { CHAINS } from '../constants/index'

export const getProvider = (chainName) => {
    let provider = CHAINS[chainName] === undefined ? CHAINS['bsc'].rpc_url : CHAINS[chainName].rpc_url;

    return new ethers.JsonRpcProvider(provider);
}