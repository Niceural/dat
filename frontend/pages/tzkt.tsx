import { useEffect } from "react"

const Page = () => {
  useEffect(() => {
    (async () => {
      const res = await fetch('https://api.tzkt.io/v1/tokens/balances' + "?" + new URLSearchParams({
        account: 'tz1LXeAGjv94wzZb9e6sRVvCvHN5J5AMjcjT',
        "token.contract": "KT1U6EHmNxJTkvaWJ4ThczG4FSDaHC21ssvi",
      }).toString()).then(res => res.json())
      console.log('> res', res)
    })()
  }, [])
  return null
}

export default Page
