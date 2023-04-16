import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import { configureChains, createClient, readContracts } from "@wagmi/core";
import {
  avalancheFuji,
  bscTestnet,
  fantomTestnet,
  sepolia,
  polygonMumbai,
  polygon,
  mainnet,
} from "@wagmi/core/chains";
import { erc20Abi } from "../assets/abi/abi";
import { contractsAddresses } from "../../config";
import { ethers } from "ethers";

export default class Core {
  constructor(vueContext) {
    this.context = vueContext;
    this.init();
  }
  async init() {
    this.chains = [
      avalancheFuji,
      bscTestnet,
      fantomTestnet,
      sepolia,
      polygonMumbai,
    ];

    const projectId = import.meta.env.VITE_PROJECT_ID;

    const { provider } = configureChains(this.chains, [
      w3mProvider({ projectId }),
    ]);
    const wagmiClient = createClient({
      autoConnect: true,
      connectors: w3mConnectors({ projectId, version: 1, chains: this.chains }),
      provider,
    });
    this.ethereumClient = new EthereumClient(wagmiClient, this.chains);
    this.web3modal = new Web3Modal({ projectId }, this.ethereumClient);
  }

  async fetchContractData(currentAddress) {
    let result = await Promise.all([
      this.readContractData("totalSupply"),
      this.readContractData("balanceOf", [currentAddress]),
    ]);
    result = this.parseContractData(result);
    this.context.$store.commit("setContractData", result);
  }

  async readContractData(name, args = []) {
    const contracts = [];
    for (let chain of this.chains) {
      const contractObj = {};
      contractObj["address"] = contractsAddresses[chain.id];
      contractObj["abi"] = erc20Abi;
      contractObj["functionName"] = name;
      contractObj["chainId"] = chain.id;
      contractObj["args"] = args;
      contracts.push(contractObj);
    }
    const data = await readContracts({ contracts });

    return data;
  }

  parseContractData(dataSet) {
    const res = {};
    const [totalSupply, balanceOf] = dataSet;

    totalSupply.forEach((el, id) => {
      const chainId = this.chains[id].id;
      const amount = ethers.utils.formatEther(el);
      const current = {
        name: "MyToken",
        symbol: "MTK",
        totalSupply: amount,
      };
      res[chainId] = current;
    });

    balanceOf.forEach((el, id) => {
      const chainId = this.chains[id].id;
      const amount = ethers.utils.formatEther(el);
      res[chainId] = { ...res[chainId], balanceOf: amount };
    });
    return res;
  }
}
