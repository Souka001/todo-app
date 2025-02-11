import './App.css';
import FirstPage from './components/FirstPage'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ToDoPage from './components/TodoPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/#" element={<FirstPage />} />
        <Route path="/#/todo" element={<ToDoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
