import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import ProductList from './pages/ProductList';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';

class App extends React.Component {
  render() {
    return (

      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={ ProductList } />
          <Route
            exact
            path="/product-details"
            render={ (props) => <ProductDetails { ...props } /> }
          />
          <Route exact path="/cart" render={ (props) => <Cart { ...props } /> } />
          <Route exact path="/checkout" render={ (props) => <Checkout { ...props } /> } />
        </Switch>
      </BrowserRouter>

    );
  }
}

export default App;
