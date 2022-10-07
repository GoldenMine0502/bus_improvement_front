import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import './App.css';
import Main from "./Main";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path='/' element={ <Main /> }/>
              {/*<Navigate path="*" to="/main" />*/}
          </Routes>
      </BrowserRouter>
  );
}

export default App;
