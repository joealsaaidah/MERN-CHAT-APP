import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ChatPage from "./ChatPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/chats' element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
