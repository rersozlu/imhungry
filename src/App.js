import "./App.css";
import { useEffect, useState } from "react";
import Card from "./components/Card";
import data from "./components/data.json";
import Header from "./components/Header";
import { ethers } from "ethers";
import abi from "./abi.json";

function App() {
  const [formValue, setFormValue] = useState("");
  const handleChange = (e) => {
    setFormValue(e.target.value);
  };
  const contractAddress = "0x545DeDeF9A3385F70fb585ABd57de811845ab156";
  const contractABI = abi.abi;
  const [walletMsg, setWalletMsg] = useState("Connect Wallet");
  const [currentAccount, setCurrentAccount] = useState("");
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have metamask!");
      } else {
        console.log("Wallet object connected: ", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account: ", account);
        setCurrentAccount(account);
        setWalletMsg("Connected");
      } else {
        console.log("No auth account found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    window.ethereum.on("accountChanged", isWalletConnected);
  });

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Download Metamask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected to write ", accounts[0]);
      const provider = new ethers.providers.Web3Provider(ethereum);
      const { chainId } = await provider.getNetwork();
      if (chainId !== 43114) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xA86A",
              rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
              chainName: "Avalanche Network",
              nativeCurrency: {
                name: "AVAX",
                symbol: "AVAX",
                decimals: 18,
              },
              blockExplorerUrls: ["https://snowtrace.io/"],
            },
          ],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const buyMe = async (amount) => {
    try {
      connectWallet();
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const myContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let buyTxn = await myContract.buy({
          value: ethers.utils.parseEther(amount),
        });
        console.log("transaction started...", buyTxn.hash);
        await buyTxn.wait();
        console.log("txn ended ", buyTxn.hash);
      } else {
        console.log("connect wallet");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    isWalletConnected();
  }, []);

  const cards = data.map((card) => (
    <Card
      key={card.id}
      id={card.id}
      title={card.title}
      price={card.price}
      image={card.image}
      description={card.description}
      handleClick={() => buyMe(card.price)}
    />
  ));

  return (
    <div className="App">
      <Header walletMsg={walletMsg} connectAcc={connectWallet} />
      <div className="cardsContainer">
        {cards}
        <div className="form">
          <h2>Custom Donation</h2>
          <br />
          <form>
            <input
              type="text"
              name="amount"
              onChange={handleChange}
              placeholder="Amount"
              value={formValue}
            />

            <br />
            <br />
            <button
              className="buy"
              onClick={(e) => {
                e.preventDefault();
                buyMe(formValue);
              }}
            >
              Avax
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
