import './App.css';
import Home from './components/Home';
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from 'react-router';
import Room from './components/Room';
import Details from './components/Details';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route element={<Home />}
            path="/"/>

            <Route element={<Room/>} 
            path="/session/:id"/>

            <Route element={<Details/>}
            path="/details/:detailId"/>

        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
