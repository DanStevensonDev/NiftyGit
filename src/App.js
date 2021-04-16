import './App.css';

import { Router } from '@reach/router'

import Home from './components/Home'
import MintYourCommits from './components/MintYourCommits'

function App() {
  return (
    <div className="App">
      <Router className="content">
        <Home path="/"/>
        <MintYourCommits path="/mint-your-commits" />
      </Router>
    </div>
  );
}

export default App;
