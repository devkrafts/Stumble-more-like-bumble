import './App.css';
import Home from './components/Home';
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from 'react-router';
import Room from './components/Room';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route element={<Home />}
            path="/"/>

            <Route element={<Room/>} 
            path="/session"/>

        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
