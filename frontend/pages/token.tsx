import { useState, useEffect } from 'react'
import {readToken} from '../utils/tokens'
import getImageUrl from '../utils/getImageUrl'
import { CONTRACT_ADDRESS } from '../constants/contract'
import tokenData from '../misc/tokenData.json'

const Page = () => {
  const [metadata, setMetadata] = useState<any>()

  useEffect(() => {
    readToken(CONTRACT_ADDRESS, tokenData.tokenId)
      .then(setMetadata)
      .catch(alert)
  }, [])

  return (
    <div style={{ display: 'flex', padding: 20 }}>
      {!metadata ? "Loading Token metadata..." : (
        <>
          <img src={metadata ? getImageUrl(metadata.displayUri) : ''} alt={metadata?.name} />
          <code style={{ whiteSpace: 'pre-wrap', fontSize: 20, padding: 20 }}>
            {metadata && JSON.stringify(metadata, null, 2)}
          </code>
        </>
      )}
    </div>
  )
}

export default Page
