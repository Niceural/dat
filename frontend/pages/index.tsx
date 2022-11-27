import { useState, useEffect } from 'react'
import { connectWallet, getAccount } from "../utils/wallet";

const getShortenedAddress = (address: string) => {
  return address.substring(0, 4) + '...' + address.substring(address.length - 6, address.length)
}

const Homepage = () => {
  const [account, setAccount] = useState("");
  console.log('account', account)

  useEffect(() => {
    (async () => {
      // TODO 5.b - Get the active account
      const account = await getAccount();
      setAccount(account);
    })();
  }, []);

  const onConnectWallet = async () => {
    await connectWallet();
    const account = await getAccount();
    setAccount(account);
  };

  const renderNav = () => {
    return (
      <div style={{
        width: '100%',
        position: 'fixed',
        top: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 0',
        height: '92px',
        backdropFilter: 'blur(24px)',
        backgroundColor: 'rgba(0, 0, 0, 0)',
      }}>
        <div style={{ width: 1360, display: 'flex', alignItems: 'center' }}>
          <img src="/logo-w.png" width="50" />
          <span style={{ fontSize: 36, marginLeft: 6 }}>
            dat
          </span>
          <div style={{ flex: 1 }} />
          {renderConnect()}
        </div>
      </div>
    )
  }

  const renderConnect = () => {
    if (account) {
      return (
        <>
          <code style={{ fontFamily: 'monospace', fontSize: 16 }}>
            {getShortenedAddress(account)}
          </code>
          {/* disconnect button */}
        </>
      )
    }
    return (
      <button style={{
        color: 'white',
        fontSize: 16,
        borderRadius: 10,
        padding: '6px 12px',
        cursor: 'pointer',
      }} onClick={onConnectWallet}>
        Connect
      </button>
    )
  }

  const renderHero = () => {
    return (
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ width: 1360, marginTop: '25vh', textAlign: 'center' }}>
          <h1 style={{ fontWeight: 'normal', fontSize: 60 }}>
            Digital Assets Tag
          </h1>
          <p style={{ fontSize: 24 }}>
            Tokenizing ...... tbd
          </p>
        </div>
      </div>
    )
  }

  const renderItems = () => {
    return Array.from({ length: 5 }).map((_, index) => {
      const {
        name,
        tokenId,
        imageUrl,
        description,
      } = {
        name: `Item #${index}`,
        tokenId: index + 1,
        imageUrl: 'https://nftcardfrontendmentor.netlify.app/images/equilibrium.jpg',
        description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      }
      return (
        <div key={index} style={{
          borderRadius: 16,
          background: 'rgba(255, 255, 255, 0.3)',
          padding: 16,
          flexBasis: '270px',
        }}>
          <div>
            <img style={{ width: '100%', borderRadius: 8, marginBottom: 16 }} src={imageUrl} />
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>
              {name}
            </div>
            <p>
              {description}
            </p>
          </div>
        </div>
      )
    })
  }

  return (
    <div style={{
      height: '100vh',
      backgroundImage: 'linear-gradient(to right bottom, #007ec6, #0096d3, #00add9, #00c3d7, #00d7d1, #12e1c9, #36eabd, #58f2ae, #6ef4a5, #81f69d, #93f795, #a4f88d)',
    }}>
      {renderNav()}
      {/* {renderHero()} */}
      {!account ? renderHero() : (
        <div style={{
          paddingTop: 92,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'scroll',
          height: '100vh',
        }}>
          <div style={{ width: 1360, marginTop: 100 }}>
            <p style={{ fontSize: 28 }}>
              Owned NFTs
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, paddingBottom: 120 }}>
              {renderItems()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Homepage
