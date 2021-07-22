import { setup as setupENS } from '../api/ens'

const INFURA_ID = process.env.REACT_APP_INFURA_ID
const PORTIS_ID = '57e5d6ca-e408-4925-99c4-e7da3bdb8bf5'
let provider
const option = {
  network: 'mainnet', // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: () => import('@walletconnect/web3-provider'),
      packageFactory: true,
      options: {
        infuraId: INFURA_ID
      }
    },
    // Alphabetical order from now on.
    authereum: {
      package: () => import('authereum'),
      packageFactory: true
    },
    mewconnect: {
      package: () => import('@myetherwallet/mewconnect-web-client'),
      packageFactory: true,
      options: {
        infuraId: INFURA_ID,
        description: ' '
      }
    },
    portis: {
      package: () => import('@portis/web3'),
      packageFactory: true,
      options: {
        id: PORTIS_ID
      }
    },
    torus: {
      package: () => import('@toruslabs/torus-embed'),
      packageFactory: true
    }
  }
}
let web3Modal
export const connect = async () => {
  try {
    const Web3Modal = (await import('web3modal-dynamic-import')).default
    const { getNetwork } = await import('@ensdomains/ui')

    web3Modal = new Web3Modal(option)
    provider = await web3Modal.connect()
    await setupENS({
      customProvider: provider,
      reloadOnAccountsChange: true,
      enforceReload: true
    })
    return await getNetwork()
  } catch (e) {
    if (e !== 'Modal closed by user') {
      throw e
    }
  }
}

export const disconnect = async function() {
  // Disconnect wallet connect provider
  if (provider && provider.disconnect) {
    provider.disconnect()
  }
  await setupENS({
    reloadOnAccountsChange: true,
    enforceReadOnly: true,
    enforceReload: true
  })
  if (web3Modal) {
    await web3Modal.clearCachedProvider()
  }
}
