const getImageUrl = (ipfsUrl: string) => {
  return "https://ipfs.io/ipfs/" + ipfsUrl.split("ipfs://")[1]
}

export default getImageUrl
