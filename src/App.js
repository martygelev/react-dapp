import { ethers } from 'ethers';
import { useState } from 'react';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'

import './App.css';

const greeterAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"
const tokenAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6"


function App() {

  const [greeting, setGreetingValue] = useState('');
  const [userAccount, setUserAccount] = useState('');
  const [amount, setAmount] = useState();
  const [currentBalance, setCurrentBalance] = useState();

  async function getBalance() {
    console.log("*** getBalance ***");
    if(typeof window.ethereum !== 'undefined'){
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const balance = await contract.balanceOf(account)
      setCurrentBalance(JSON.parse(balance));
      console.log(`Balance of account: ${account} is ${balance}`);
    }
  }

  async function sendCoins() {
    console.log("*** sendCoins ***");
    if(typeof window.ethereum !== 'undefined'){
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, amount);
      await transaction.wait();

      console.log(`${amount} coins sent to ${userAccount}`);
      setAmount("");
      setUserAccount("");
      getBalance();
    }
  }

  async function requestAccount() {
    console.log("*** requestAccount ***")
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchGreeting() {
    console.log("*** fetchGreeting ***");
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(window.ethereum);
      console.log("Provider: " + { provider });
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
      try {
        const data = await contract.greet();
        console.log('Data: ' + data);
      } catch (err) {
        console.log('Error: ' + err);
      }
    }    
  }

  async function setGreeting() {
    console.log('--- setGreeting ---');
    if (!greeting || greeting.length===0){
      console.log("no greeting message")
      return
    }
    if(typeof window.ethereum !== 'undefined'){
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log("Provider: " + { provider });
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      setGreetingValue('');
      await transaction.wait();
      fetchGreeting();
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input 
          onChange={e => setGreetingValue(e.target.value)} 
          placeholder="Set greeting" 
          value={greeting}
          required />

          <br />
          <hr />

          <button onClick={getBalance}>Get Current Balance</button>
          {currentBalance && <p> Your current balance is {currentBalance} </p> }
         
          <input 
            onChange={e => setUserAccount(e.target.value)} 
            placeholder="Account ID" 
            required 
            value={userAccount}
            />
          <input 
            onChange={e => setAmount(e.target.value)} 
            placeholder="Amount" 
            required 
            value={amount}
          />
           <button onClick={sendCoins}>Send Coins</button>

      </header>
    </div>
  );
}

export default App;
