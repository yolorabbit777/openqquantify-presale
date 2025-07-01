import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

const projectId = '10c3f4eecf1028fe1a8644acef29b6e9';

const mainnet = {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/scS7rThd70YD61xEU80rJAZnQArQ36Dw'
}

const bsc = {
    chain_id: 56,
    name: 'BSC Mainnet',
    currency: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    explorerUrl: 'https://bscscan.com/'
}
const sepolia = {
    chainId: 11155111,
    name: 'Sepolia',
    currency: 'SepoliaETH',
    explorerUrl: 'https://sepolia.etherscan.io',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/s6C7JIaQX-lqPyFsZBZe8fIR2eofhnI1'
}

const metadata = {
    name: 'OpenQQuantify Presale',
    description: 'New Funding Project for Digital AI.',
    url: 'https://presale.openqquantify.com/',
    icons: []
}

createWeb3Modal({
    ethersConfig: defaultConfig({ metadata }),
    chains: [bsc],
    projectId,
    enableAnalytics: true
})