import './App.css';

import { Router } from '@reach/router'

import Home from './components/Home'
// import HeaderIntro from './components/HeaderIntro'
// import CommitFetcher from './components/CommitFetcher' 
// import MetaMaskTests from './components/MetaMaskTests'

function App() {
  return (
    <div className="App">
      <Router className="content">
        <Home path="/"/>
      {/* <HeaderIntro />
      <CommitFetcher />
      <MetaMaskTests /> */}
      </Router>
    </div>
  );
}

export default App;
