import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class ProductDetails extends Component {
  constructor() {
    super();
    this.state = {
      myCart: [],
      email: '',
      textarea: '',
      verify: true,
      rate: '',
    };
  }

  componentDidMount() {
    this.setState({ myCart: JSON.parse(localStorage.getItem('cart')) || [] });
    const { location: { state: { elem } } } = this.props;
    const storage = JSON.parse(localStorage.getItem(elem.id)) || [];
    this.setState({ status: storage });
  }

  handleBtn = () => {
    const { history } = this.props;
    history.push('/cart');
  }

  handleAddToCart = () => {
    const { location: { state: { elem } } } = this.props;
    let array = [];
    const storage = localStorage.getItem('cart');
    if (storage === null) {
      array.push(elem);
      localStorage.setItem('cart', JSON.stringify(array));
    } else {
      array = JSON.parse(localStorage.getItem('cart'));
      array.push(elem);
      localStorage.setItem('cart', JSON.stringify(array));
    }
    this.setState({ myCart: JSON.parse(localStorage.getItem('cart')) });
  }

  verifyBtn = () => {
    const { email, rate } = this.state;
    const regex = /\S+@\S+\.\S+/;
    const verify = regex.test(email) && email.length && rate;
    this.setState({ verify });
    return verify;
  }

  onChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  }

  resetInput = () => {
    this.setState({
      email: '',
      textarea: '',
    });
  }

  submitReview = ({ target }) => {
    if (this.verifyBtn()) {
      const { email, rate, textarea } = this.state;
      const reviewObj = {
        email,
        rate,
        textarea,
      };
      let array = [];
      const storage = localStorage.getItem(`${target.id}`);
      if (storage === null) {
        array.push(reviewObj);
        localStorage.setItem(`${target.id}`, JSON.stringify(array));
        this.setState({ status: array });
      } else {
        array = JSON.parse(localStorage.getItem(`${target.id}`));
        array.push(reviewObj);
        localStorage.setItem(`${target.id}`, JSON.stringify(array));
        this.setState({ status: array });
      }
      this.resetInput();
    }
    this.verifyBtn();
  }

  clickRate = ({ target }) => {
    const { id } = target;
    this.setState({ rate: id });
  }

  render() {
    const { location: { state: { elem } } } = this.props;
    const { title, price, thumbnail, cart } = elem;
    const { myCart, verify, email, textarea, status } = this.state;
    return (
      <div>
        <p data-testid="product-detail-name">{ title }</p>
        <img
          src={ thumbnail }
          alt={ title }
          data-testid="product-detail-image"
        />
        <p data-testid="product-detail-price">{ price }</p>
        <button
          type="button"
          data-testid="product-detail-add-to-cart"
          onClick={ this.handleAddToCart }
        >
          Adicione ao Carrinho
        </button>
        <Link
          to={ {
            pathname: '/cart',
            state: { cart },
          } }
          data-testid="shopping-cart-button"
        >
          Carrinho
        </Link>
        <p data-testid="shopping-cart-size">{myCart.length}</p>
        <form>
          <input
            name="email"
            type="email"
            data-testid="product-detail-email"
            placeholder="email"
            onChange={ this.onChange }
            value={ email }
          />
          <label htmlFor="check">
            <input
              id="check1"
              name="check"
              type="radio"
              data-testid="1-rating"
              onClick={ this.clickRate }
            />
            <input
              id="check2"
              name="check"
              type="radio"
              data-testid="2-rating"
              onClick={ this.clickRate }
            />
            <input
              id="check3"
              name="check"
              type="radio"
              data-testid="3-rating"
              onClick={ this.clickRate }
            />
            <input
              id="check4"
              name="check"
              type="radio"
              data-testid="4-rating"
              onClick={ this.clickRate }
            />
            <input
              id="check5"
              name="check"
              type="radio"
              data-testid="5-rating"
              onClick={ this.clickRate }
            />
          </label>
          <input
            name="textarea"
            type="text"
            data-testid="product-detail-evaluation"
            onChange={ this.onChange }
            value={ textarea }
          />
          <button
            type="button"
            data-testid="submit-review-btn"
            onClick={ this.submitReview }
            id={ elem.id }
          >
            Enviar
          </button>
        </form>
        {
          !verify && <p data-testid="error-msg">Campos inválidos</p>
        }
        {
          status && (
            status.map((item, index) => (
              <div key={ index }>
                <p data-testid="review-card-email">{ item.email }</p>
                <div data-testid="review-card-rating">
                  <input
                    type="radio"
                    checked={ item.rate === 'check1' }
                  />
                  <input
                    type="radio"
                    checked={ item.rate === 'check2' }
                  />
                  <input
                    type="radio"
                    checked={ item.rate === 'check3' }
                  />
                  <input
                    type="radio"
                    checked={ item.rate === 'check4' }
                  />
                  <input
                    type="radio"
                    checked={ item.rate === 'check5' }
                  />
                </div>
                <p data-testid="review-card-evaluation">{item.textarea}</p>
              </div>
            ))
          )
        }
      </div>
    );
  }
}

ProductDetails.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      elem: PropTypes.shape({
        title: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        thumbnail: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        cart: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            thumbnail: PropTypes.string.isRequired,
          }),
        ),
      }),
    }),
  }).isRequired,
};

export default ProductDetails;
