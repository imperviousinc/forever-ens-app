import { ethers, getNetworkId, getNetworkProviderUrl } from '@ensdomains/ui'
import Web3 from 'web3'

const ChainLinkABI = [
  {
    constant: true,
    inputs: [],
    name: 'latestAnswer',
    outputs: [{ name: '', type: 'int256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
]

async function getContract() {
  let contractAddress
  try {
    const ens = getENS()
    contractAddress = await ens.getAddress('eth-usd.data.eth')
  } catch {
    //return mainnet if it does not exist
    contractAddress = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'
  }

  if (process.env.REACT_APP_DUMMY_ORACLE) {
    contractAddress = process.env.REACT_APP_DUMMY_ORACLE
  }

  return contractAddress
}

export default async function getEtherPrice() {
  try {
    const network = await getNetworkId()
    let provider

    if (process.env.REACT_APP_STAGE !== 'local') {
      const networkProvider = getNetworkProviderUrl(
        `${network}`,
        process.env.REACT_APP_INFURA_ID
      )
      provider = new ethers.providers.JsonRpcProvider(networkProvider)
    } else {
      provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
    }

    const ethUsdContract = new ethers.Contract(
      getContract(network),
      ChainLinkABI,
      provider
    )
    return (await ethUsdContract.latestAnswer()).toNumber() / 100000000
  } catch (e) {
    console.log(e, 'error getting usd price oracle')
  }
}
