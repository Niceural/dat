import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {readToken} from '../utils/tokens'
import getImageUrl from '../utils/getImageUrl'
import Layout from '../components/Layout'

const MOCK_DESCRIPTION = `A story of (un)civilized Homosapiens trapped in a metropolitan nightmare, hoping to feel alive among all of the chaos..
------------------
Live-view_
Resolution: Add "&res=" end of your url with a resolution multiplier. (1-2-4) (Default:2=2400x3200px)
Press S: Saves the current scene.
LeftMouse: Controls the zoom level.
------------------
Created with p5.js`

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
                <img
                  style={{ width: '100%', borderRadius: 24 }}
                  src={
                    metadata
                      ? metadata.displayUri === "https://github.com/oxheadalpha/nft-tutorial/blob/master/packages/tznft/README.mdNERD_tree_1transfer-tokens"
                        ? 'https://nftcardfrontendmentor.netlify.app/images/equilibrium.jpg'
                        : getImageUrl(metadata.displayUri)
                      : ''
                  }
                  alt={metadata?.name}
                />
              </div>
              <div>
                <h1 style={{ fontWeight: 'normal', fontSize: 66, margin: '0 0 16px 0' }}>
                  {metadata.name}
                </h1>
                <p style={{ whiteSpace: 'pre-wrap' }}>
                  {metadata.description || MOCK_DESCRIPTION}
                </p>
                {/* <code style={{ flex: 1, whiteSpace: 'pre-wrap', fontSize: 12 }}>
                  {metadata && JSON.stringify(metadata, null, 2)}
                </code> */}
                <div style={{ borderTop: '2px solid rgba(255, 255, 255, 0.5)', marginTop: 20, paddingTop: 12, fontSize: 28 }}>
                  Owned by: Bob
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Page
