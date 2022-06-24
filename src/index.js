import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
//import 'core-js/es/object'
import App from 'App'

import { GlobalStateProvider } from 'globalState'
import 'globalStyles'
import './i18n'
import { handleNetworkChange } from './utils/utils'
import { setIdentifier } from './utils/affiliate'

window.addEventListener('load', async () => {
  console.log('app config', process.env)
  const { client, networkId } = await handleNetworkChange()
  setIdentifier()
  ReactDOM.render(
    <Suspense fallback={null}>
      <GlobalStateProvider>
        <App initialClient={client} initialNetworkId={networkId} />
      </GlobalStateProvider>
    </Suspense>,
    document.getElementById('root')
  )
})
