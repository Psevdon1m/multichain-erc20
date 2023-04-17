import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import {
  configureChains,
  createClient,
  readContracts,
  prepareWriteContract,
  writeContract,
  multicall,
} from "@wagmi/core";
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
    this.defaultChains = [sepolia];

    const projectId = import.meta.env.VITE_PROJECT_ID;

    const { provider } = configureChains(
      this.chains,
      [w3mProvider({ projectId })],
      { defaultChains: this.defaultChains }
    );
    const wagmiClient = createClient({
      autoConnect: true,
      connectors: w3mConnectors({ projectId, version: 1, chains: this.chains }),
      provider,
    });
    this.ethereumClient = new EthereumClient(wagmiClient, this.chains);
    this.web3modal = new Web3Modal({ projectId }, this.ethereumClient);
  }

  fetchContractDataInLoop(currentAddress, interval = 10000) {
    this.fetchContractDataInterval = setInterval(async () => {
      console.log("in interval");
      await this.fetchContractData(currentAddress);
    }, interval);
  }

  async fetchContractData(currentAddress) {
    try {
      console.log("start", currentAddress);
      let result = await Promise.all([
        this.readContractData("totalSupply"),
        this.readContractData("balanceOf", [currentAddress]),
      ]);
      result = this.parseContractData(result);
      this.context.$store.commit("setContractData", result);
      console.log("finish");
    } catch (error) {
      console.log(error);
    }
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

  async writeContract(name, chainId, args = []) {
    try {
      const config = await prepareWriteContract({
        address: contractsAddresses[chainId],
        abi: erc20Abi,
        functionName: name,
        args,
      });
      const data = await writeContract(config);
      await data.wait(2);
    } catch (error) {
      console.log(error);
    }
  }

  parseContractData(dataSet) {
    const res = {};
    const [totalSupply, balanceOf] = dataSet;

    totalSupply.forEach((el, id) => {
      const chainId = this.chains[id].id;
      let amount;
      if (el) {
        amount = parseFloat(Number(ethers.utils.formatEther(el)).toFixed(4));
      } else {
        amount = 0;
      }

      const current = {
        name: "MyToken",
        symbol: "MTK",
        totalSupply: amount,
      };
      res[chainId] = current;
    });

    balanceOf.forEach((el, id) => {
      const chainId = this.chains[id].id;
      let amount;
      if (el) {
        amount = parseFloat(Number(ethers.utils.formatEther(el)).toFixed(4));
      } else {
        amount = 0;
      }
      res[chainId] = { ...res[chainId], balanceOf: amount };
    });
    return res;
  }
}
