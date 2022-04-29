import "./App.css";
import { useEffect, useState } from "react";
import Card from "./components/Card";
import data from "./components/data.json";
import Header from "./components/Header";
import { ethers } from "ethers";
import abi from "./abi.json";

function App() {
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
      } else {
        console.log("No auth account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      setWalletMsg("Connected");
      console.log("Connected", accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const buyMe = async (amount) => {
    try {
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
      <div className="cardsContainer">{cards}</div>
    </div>
  );
}

export default App;
