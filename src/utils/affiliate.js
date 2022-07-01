// The identifier is valid for 30 days (Date.now() returns ms).
const IDENTIFIER_LIFETIME = 30 * 24 * 60 * 60 * 1000

export function setIdentifier() {
  const parameters = window.location.href.split('?')[1]
  if (typeof parameters !== 'undefined') {
    const searchParameters = new URLSearchParams(parameters)
    let hasTag = false

    for (let keyValues of searchParameters.entries()) {
      if (/^fid$/i.test(keyValues[0]) && /^[0-9]+$/.test(keyValues[1])) {
        localStorage.setItem(
          'fid',
          JSON.stringify({
            identifier: keyValues[1],
            expiration: Date.now() + IDENTIFIER_LIFETIME
          })
        )
      } else if (
        /^tag$/i.test(keyValues[0]) &&
        /^[a-zA-Z0-9\-_]+$/.test(keyValues[1])
      ) {
        localStorage.setItem('tag', keyValues[1])
        hasTag = true
      }
    }

    if (!hasTag && localStorage.getItem('tag') != null) {
      localStorage.removeItem('tag')
    }
  }
}

function getLocalStorageData() {
  const data = localStorage.getItem('fid')
  if (data != null) {
    const parsedData = JSON.parse(data)
    if (
      Date.now() < parseInt(parsedData.expiration, 10) &&
      /^[0-9]+$/.test(parsedData.identifier)
    ) {
      let tag = localStorage.getItem('tag')
      if (tag == null || !/^[a-zA-Z0-9\-_]+$/.test(tag)) {
        tag = ''
      }
      return {
        fid: parsedData.identifier,
        tag: tag
      }
    }
  }

  return null
}

export async function logEvent(state, domain) {
  const localStorageData = getLocalStorageData()
  if (localStorageData != null) {
    await fetch('https://www.webgnomes.org/log.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        fid: localStorageData.fid,
        tag: localStorageData.tag,
        state: state,
        domain: domain
      })
    })
  }
}
