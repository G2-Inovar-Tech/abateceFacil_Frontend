import logo from './logo.svg';
import logoEmpresa from './assets/Backgorund 1.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={`${process.env.PUBLIC_URL}/logoEmpresa.png`} className="App-logo" alt="logo" />
        <br/><br/><br/><br/>
        <p>
          Teste teste
        </p>
        <img src={logoEmpresa} alt="logo"/>
      </header>
    </div>
  );
}

export default App;
