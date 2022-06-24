// The identifier is valid for 30 days (Date.now() returns ms).
const IDENTIFIER_LIFETIME = 30 * 24 * 60 * 60 * 1000

export function setIdentifier() {
  const parameters = window.location.href.split('?')[1]
  if (typeof parameters !== 'undefined') {
    const searchParameters = new URLSearchParams(parameters)

    for (let keyValues of searchParameters.entries()) {
      if (/^fid$/i.test(keyValues[0]) && /^[0-9]+$/.test(keyValues[1])) {
        localStorage.setItem(
          'fid',
          JSON.stringify({
            identifier: keyValues[1],
            expiration: Date.now() + IDENTIFIER_LIFETIME
          })
        )
        break
      }
    }
  }
}

export function getIdentifier() {
  const data = localStorage.getItem('fid')
  if (data != null) {
    const parsedData = JSON.parse(data)
    if (
      Date.now() < parseInt(parsedData.expiration, 10) &&
      /^[0-9]+$/.test(parsedData.identifier)
    ) {
      return parsedData.identifier
    }
  }

  return null
}

export async function logEvent(state, domain) {
  const fid = getIdentifier()
  if (fid != null) {
    await fetch('https://www.webgnomes.org/log.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        fid: fid,
        state: state,
        domain: domain
      })
    })
  }
}
