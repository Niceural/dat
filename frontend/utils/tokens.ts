import { TezosToolkit } from '@taquito/taquito'
import { Tzip12Module, tzip12 } from '@taquito/tzip12';

const Tezos = new TezosToolkit("https://mainnet.api.tez.ie");
Tezos.addExtension(new Tzip12Module());

export const readToken = async (contractAddress: string, tokenId: number) => {
  const contract = await Tezos.contract.at(contractAddress, tzip12);
  return contract.tzip12().getTokenMetadata(tokenId); // Tzip12ContractAbstraction method
}

// const MOCK_WALLET_ADDRESS = "tz1LXeAGjv94wzZb9e6sRVvCvHN5J5AMjcjT"
// const readBalance = async () => {
//   const res = await Tezos.tz.getBalance(MOCK_WALLET_ADDRESS)
//   console.log(res.toNumber() / 1000000)
// }
