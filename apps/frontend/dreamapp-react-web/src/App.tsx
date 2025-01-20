// import { useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import './App.css';
// import { Button } from 'antd';
// import { useDispatch, useSelector } from 'react-redux';
// import { add, sub } from './store/modules/test.ts';
import RouterView from './router';
import { HashRouter as Router } from 'react-router-dom';
import MenuLeft from './components/MenuLeft';
import TopBar from './components/TopBar';

function App() {
  return (
    <div className="w-full absolute bottom-0 left-0 top-0 right-0 flex flex-col">
      <TopBar></TopBar>
      <div>
        <MenuLeft></MenuLeft>
        <Router>
          <RouterView></RouterView>
        </Router>
      </div>
    </div>
  );
}

export default App;
