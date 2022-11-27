import React, { useEffect } from 'react'
import Link from 'next/link'
import useUserContext from './UserContext';
import { connectWallet, getAccount } from "../utils/wallet";

const getShortenedAddress = (address: string) => {
  return address.substring(0, 4) + '...' + address.substring(address.length - 6, address.length)
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { account, setAccount } = useUserContext()

  useEffect(() => {
    (async () => {
      const account = await getAccount();
      console.log('set account', account)
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

  return (
    <div style={{
      height: '100vh',
      backgroundImage: 'linear-gradient(to right bottom, #007ec6, #0096d3, #00add9, #00c3d7, #00d7d1, #12e1c9, #36eabd, #58f2ae, #6ef4a5, #81f69d, #93f795, #a4f88d)',
    }}>
      {renderNav()}
      {children}
    </div>
  );
};

export default Layout;
