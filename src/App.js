import './App.css';

import { Router } from '@reach/router'

import Home from './components/Home'
import MintMyCommits from './components/MintMyCommits'

function App() {
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
