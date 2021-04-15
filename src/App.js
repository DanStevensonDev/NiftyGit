import './App.css';
import HeaderIntro from './components/HeaderIntro'
import CommitFetcher from './components/CommitFetcher'
import MetaMaskTests from './components/MetaMaskTests'

function App() {
  return (
    <div className="App">
      <HeaderIntro />
      <CommitFetcher />
      <MetaMaskTests />
    </div>
  );
}

export default App;
