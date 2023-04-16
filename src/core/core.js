import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import { configureChains, createClient, watchAccount } from "@wagmi/core";
import {
  avalancheFuji,
  bscTestnet,
  fantomTestnet,
  sepolia,
  polygonMumbai,
  polygon,
  mai,
  mainnetnnet,
} from "@wagmi/core/chains";
import { erc20Abi } from "../assets/abi/abi";

export default class Core {
  constructor(vueContext) {
    this.context = vueContext;
    this.init();
  }
  async init() {
    const chains = [
      avalancheFuji,
      bscTestnet,
      fantomTestnet,
      sepolia,
      polygonMumbai,
      polygon,
      mainnet,
    ];

    const projectId = import.meta.env.VITE_PROJECT_ID;
    console.log(projectId);

    const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
    const wagmiClient = createClient({
      autoConnect: true,
      connectors: w3mConnectors({ projectId, version: 1, chains }),
      provider,
    });
    this.ethereumClient = new EthereumClient(wagmiClient, chains);
    this.web3modal = new Web3Modal({ projectId }, this.ethereumClient);
  }
}
