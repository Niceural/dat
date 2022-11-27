// TODO 2.a - Setup beacon wallet instance
import { BeaconWallet } from "@taquito/beacon-wallet";

const wallet = new BeaconWallet({
  name: "Digital Assets Tag",
  // @ts-ignore
  preferredNetwork: "ghostnet",
});

// TODO 2.b - Setup connectWallet function (on ghostnet)
export const connectWallet = async () => {
  await wallet.requestPermissions({
    network: {
      // @ts-ignore
      type: "ghostnet",
    }
  });
};

// TODO 2.c - Setup getAccount function
export const getAccount = async () => {
  const activeAccount = await wallet.client.getActiveAccount();
  if (activeAccount) {
    return activeAccount.address;
  } else {
    return "";
  }
};
