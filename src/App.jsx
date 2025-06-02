import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Todo from "./compunet/Todo";
import TodoScreen from "./compunet/TodoScreen";
import Login from "./compunet/Login";
import Signup from "./compunet/Signup";

const App = () => {
  return (
    <Router>
     
        <Routes>
          <Route path="/" element={<TodoScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/todo"
            element={
            
                <Todo />
           
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
  
    </Router>
  );
};

export default App;