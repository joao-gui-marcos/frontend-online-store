import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Cart extends Component {
  constructor() {
    super();
    this.state = {
      newCart: [],
      counting: [],
      quantity: [],
      /* newCartThumb: [],
      newCartPrice: [],
      newCartTitle: [],
      newCartId: [], */
    };
    this.verifyQuantity = this.verifyQuantity.bind(this);
  }

  componentDidMount() {
    const { counting, newCart } = this.state;
    // const { location: { state: { cart } } } = this.props;
    const cart2 = JSON.parse(localStorage.getItem('cart')) || [];
    const cartThumbnail = cart2.map((elem) => elem.thumbnail);
    const cartPrice = cart2.map((elem) => elem.price);
    const cartTitle = cart2.map((elem) => elem.title);
    const cartId = cart2.map((elem) => elem.id);

    const newCartThumb = [...new Set(cartThumbnail)];
    const newCartPrice = [...new Set(cartPrice)];
    const newCartTitle = [...new Set(cartTitle)];
    const newCartId = [...new Set(cartId)];

    // this.setState({ newCartThumb, newCartPrice, newCartTitle, newCartId });
    newCartId.forEach((elem, index) => {
      counting.push(this.countProducts(elem));
      const product = {
        price: newCartPrice[index],
        thumbnail: newCartThumb[index],
        title: newCartTitle[index],
        id: newCartId[index],
      };
      newCart.push(product);
    });

    this.setState({ counting, newCart });
    // this.saveProduct();
    this.verifyQuantity();
  }

  countProducts= (id) => {
    // const { location: { state: { cart } } } = this.props;
    const cart2 = JSON.parse(localStorage.getItem('cart'));
    let counter = 0;
    cart2.forEach((elem) => {
      if (elem.id === id) { counter += 1; }
    });

    return counter;
  }

  subProduct = (event) => {
    const { counting } = this.state;
    if (counting[event.target.name] > 1) {
      counting[event.target.name] -= 1;
    }

    this.setState({ counting });
    // this.saveProduct();
  };

  addProduct = (event) => {
    const { counting, quantity } = this.state;
    if (counting[event.target.name] < quantity[event.target.name]) {
      counting[event.target.name] += 1;
    }
    this.setState({ counting });
    // this.saveProduct();
  };

  removeProduct = (event) => {
    const { counting, newCart } = this.state;
    counting.splice(event.target.name, 1);
    newCart.splice(event.target.name, 1);
    this.setState({ counting, newCart });
    // this.saveProduct();
  }

  saveProduct = () => {
    const { counting, newCart } = this.state;
    const cart = [];
    if (counting.length !== 0) {
      counting.forEach((elem, index) => {
        for (let i = 0; i < elem; i += 1) {
          cart.push(newCart[index]);
        }
      });
    }
    console.log(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  verifyQuantity() {
    const { quantity, newCart } = this.state;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    newCart.forEach((elem) => {
      const product = cart.find((elem2) => elem2.id === elem.id);
      quantity.push(product.available_quantity);
    });
    this.setState({ quantity });
  }

  render() {
    const { newCart, counting, quantity } = this.state;
    return (
      <div>
        Cart
        <p data-testid="shopping-cart-empty-message">Seu carrinho está vazio</p>

        {newCart.map((elem, index) => (
          <div key={ index }>
            <p data-testid="shopping-cart-product-name">
              { elem.title }
            </p>

            <img alt="Foto do Produto" src={ elem.thumbnail } />

            <p>
              { elem.price }
            </p>

            <p data-testid="shopping-cart-product-quantity">
              { counting[index] }
            </p>

            <button
              name={ index }
              type="button"
              data-testid="product-decrease-quantity"
              onClick={ this.subProduct }
            >
              -
            </button>

            <button
              name={ index }
              type="button"
              data-testid="product-increase-quantity"
              onClick={ this.addProduct }
            >
              +
            </button>

            <button
              name={ elem.id }
              type="button"
              data-testid="remove-product"
              onClick={ this.removeProduct }
            >
              X
            </button>
            <p>{quantity[index]}</p>
          </div>))}
        <Link
          to={ {
            pathname: '/checkout',
            state: { newCart, counting },
          } }
          data-testid="checkout-products"
        >
          Finalizar Compra
        </Link>
      </div>
    );
  }
}

Cart.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      cart: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          price: PropTypes.number.isRequired,
          thumbnail: PropTypes.string.isRequired,
        }),
      ),
    }),
  }).isRequired,
};

export default Cart;
