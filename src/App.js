import { ethers } from 'ethers';
import { useState } from 'react';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import './App.css';

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

function App() {

  const [greeting, setGreetingValue] = useState('');

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
      </header>
    </div>
  );
}

export default App;
