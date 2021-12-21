import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Dashboard from './componant/dashboard';


function App() {
  return (
    <Router>
      <Route path="/" exact component={Dashboard}></Route>
    </Router>
  );
}

export default App;
