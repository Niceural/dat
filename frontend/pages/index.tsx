import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic';
import getImageUrl from '../utils/getImageUrl';
import { CONTRACT_ADDRESS } from '../constants/contract'
import useUserContext from '../components/UserContext'
import Layout from '../components/Layout'

const Tilt = dynamic(() => import('react-parallax-tilt'), {
  ssr: false
})

const Homepage = () => {
  const { account } = useUserContext()
  const [tokens, setTokens] = useState<any[]>()

  useEffect(() => {
    if (!account) {
      setTokens([])
      return
    }
    if (!CONTRACT_ADDRESS) {
      throw new Error("process.env.NEXT_PUBLIC_CONTRACT_ADDRESS must be provided")
    }
    (async () => {
      const tokens = await fetch('https://api.tzkt.io/v1/tokens/balances' + "?" + new URLSearchParams({
        account,
        "token.contract": CONTRACT_ADDRESS,
      }).toString()).then(res => res.json())
      setTokens(tokens)
    })()
  }, [account])

  const renderHero = () => {
    return (
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ width: 1360, marginTop: '18vh', textAlign: 'left' }}>
          <h1 style={{
            fontWeight: 'normal',
            fontSize: 110,
            lineHeight: 1,
            marginBottom: 36,
          }}>
            digital<br />
            assets<br />
            tag
          </h1>
          <p style={{ fontSize: 36 }}>
            Digitizing receipts using NFT and RFID tag
          </p>
        </div>
      </div>
    )
  }

  const renderItems = () => {
    if (!tokens || tokens.length === 0) {
      return "No NFTs to show"
    }
    return tokens.map(({ token, id }) => {
      const {
        displayUri,
        name,
        description,
        ownerName,
      } = token.metadata
      return (
        <Link href={`/token?contractAddress=${token.contract.address}&tokenId=${token.tokenId}`} key={id}>
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} tiltReverse>
            <div className="preview-card" style={{
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.3)',
              padding: 16,
              flex: '0 0 270px',
              maxWidth: '270px',
              cursor: 'pointer',
            }}>
              <div style={{ textAlign: 'center' }}>
                <img style={{ borderRadius: 8, marginBottom: 16, height: 238 }} src={getImageUrl(displayUri)} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 'bold' }}>
                {name}
              </div>
              <div className="line-clamp">
                {description}
              </div>
              <div style={{ borderTop: '2px solid rgba(255, 255, 255, 0.5)', marginTop: 20, paddingTop: 12 }}>
                Owned by: {ownerName || "Bob"}
              </div>
            </div>
          </Tilt>
        </Link>
      )
    })
    // return Array.from({ length: 5 }).map((_, index) => {
    //   const {
    //     name,
    //     tokenId,
    //     imageUrl,
    //     description,
    //   } = {
    //     name: `Item #${index}`,
    //     tokenId: index + 1,
    //     imageUrl: 'https://nftcardfrontendmentor.netlify.app/images/equilibrium.jpg',
    //     description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    //   }
    //   return (
    //     <div key={index} style={{
    //       borderRadius: 16,
    //       background: 'rgba(255, 255, 255, 0.3)',
    //       padding: 16,
    //       flexBasis: '270px',
    //     }}>
    //       <div>
    //         <img style={{ width: '100%', borderRadius: 8, marginBottom: 16 }} src={imageUrl} />
    //         <div style={{ fontSize: 18, fontWeight: 'bold' }}>
    //           {name}
    //         </div>
    //         <p>
    //           {description}
    //         </p>
    //       </div>
    //     </div>
    //   )
    // })
  }

  return (
    <Layout>
      {!account ? renderHero() : (
        <div style={{
          paddingTop: 92,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          overflow: 'scroll',
          height: '100vh',
        }}>
          <div style={{ width: 1360, marginTop: 36 }}>
            <p style={{ fontSize: 28 }}>
              Owned NFTs
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, paddingBottom: 120 }}>
              {renderItems()}
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Homepage
