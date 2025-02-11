import './App.css';
import FirstPage from './components/FirstPage'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter, Routes, Route } from "react-router-dom"; // Add HashRouter here
import ToDoPage from './components/TodoPage';

function App() {
  return (
    <HashRouter> 
      <Routes>
        <Route path="/#" element={<FirstPage />} />
        <Route path="/#/todo" element={<ToDoPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
