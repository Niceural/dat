import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {readToken} from '../utils/tokens'
import getImageUrl from '../utils/getImageUrl'
import Layout from '../components/Layout'

const Page = () => {
  const router = useRouter()
  const [metadata, setMetadata] = useState<any>()

  const contractAddress = router.query.contractAddress as string
  const tokenId = router.query.tokenId as string

  useEffect(() => {
    if (!tokenId || !contractAddress) {
      return
    }
    readToken(contractAddress, parseInt(tokenId, 10))
      .then(setMetadata)
      .catch(alert)
  }, [contractAddress, tokenId])

  return (
    <Layout>
      <div style={{
        paddingTop: 92,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        overflow: 'scroll',
        height: '100vh',
        paddingBottom: 60,
      }}>
        <div style={{ width: 1360, marginTop: 36, display: 'flex', gap: 36 }}>
          {!metadata ? "Loading Token metadata..." : (
            <>
              <div style={{ maxWidth: 500, flexShrink: 0 }}>
                <img style={{ width: '100%' }} src={metadata ? getImageUrl(metadata.displayUri) : ''} alt={metadata?.name} />
              </div>
              <div>
                <h1 style={{ fontWeight: 'normal', fontSize: 66, margin: '0 0 16px 0' }}>
                  {metadata.name}
                </h1>
                <p style={{ whiteSpace: 'pre-wrap' }}>
                  {metadata.description}
                </p>
                {/* <code style={{ flex: 1, whiteSpace: 'pre-wrap', fontSize: 12 }}>
                  {metadata && JSON.stringify(metadata, null, 2)}
                </code> */}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Page
