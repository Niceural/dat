import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router';
import useUserContext from './UserContext';
import { connectWallet, disconnectWallet, getAccount } from "../utils/wallet";

const getShortenedAddress = (address: string) => {
  return address.substring(0, 4) + '...' + address.substring(address.length - 6, address.length)
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { account, setAccount, reset } = useUserContext()
  const router = useRouter()

  useEffect(() => {
    (async () => {
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
        zIndex: 1000,
      }}>
        <div style={{ width: 1360, display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo-w.png" width="50" />
            <span style={{ fontSize: 36, marginLeft: 6 }}>
              dat
            </span>
          </Link>
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
          <button className='disconnect' style={{
          }} onClick={() => {
            reset()
            disconnectWallet()
            router.push('/')
          }}>
            Disconnect
          </button>
        </>
      )
    }
    return (
      <button className='connect' onClick={onConnectWallet}>
        Connect
      </button>
    )
  }

  const renderBgLogo = () => {
    return (
      <div style={{ position: 'fixed', zIndex: 1, right: '-25%', top: 0 }}>
        <img src="/logo-white.svg" style={{ height: '110vh' }} />
      </div>
    )
  }

  return (
    <div className="bg" style={{
      height: '100vh',
    }}>
      {renderBgLogo()}
      {renderNav()}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
