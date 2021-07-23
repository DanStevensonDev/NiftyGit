import './App.css';

import { Router } from '@reach/router'

import Home from './components/Home'
import MintMyCommits from './components/MintMyCommits'

function App() {
  // add event listeners at top level of App
  // to check whenever crypto account or chainId is changed
  // and reload the page
  
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    })
  
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
  }

  return (
    <div className="App">
      <Router className="content">
        <Home path="/"/>
        <MintMyCommits path="/mint-my-commits" />
      </Router>
    </div>
  );
}

export default App;
