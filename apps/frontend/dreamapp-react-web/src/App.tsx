import './App.css';
import RouterView from './router';
import { HashRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <RouterView></RouterView>
    </Router>
  );
}

export default App;
