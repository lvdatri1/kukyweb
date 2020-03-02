import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/Home";
import NewPage from "./pages/NewPage";
import RootReducer from "./reducers";

// const persistedReducer = persistReducer(persistConfig, RootReducer);
export const store = createStore(RootReducer, applyMiddleware(thunk));
// let persistor = persistStore(store);

function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;
