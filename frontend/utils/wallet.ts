import { BeaconWallet } from "@taquito/beacon-wallet";

const initBeaconWallet = () => {
  return new BeaconWallet({
    name: "Digital Assets Tag",
    // @ts-ignore
    preferredNetwork: "ghostnet",
  })
}

let wallet = initBeaconWallet()

export const connectWallet = async () => {
  await wallet.requestPermissions({
    network: {
      // @ts-ignore
      type: "ghostnet",
    }
  });
};

export const getAccount = async () => {
  const activeAccount = await wallet.client.getActiveAccount();
  if (activeAccount) {
    return activeAccount.address;
  } else {
    return "";
  }
};

export const disconnectWallet = async () => {
  return await wallet.clearActiveAccount()
}
