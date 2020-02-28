import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/Home";
import NewPage from "./pages/NewPage";

function App() {
  return (
    <Router>
      <NewPage></NewPage>
      <Switch>
        <Route path="/welcome">
          <WelcomePage></WelcomePage>
        </Route>
        <Route path="/">
          <HomePage msg="I love"></HomePage>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
