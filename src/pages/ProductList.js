import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getCategories, getProductsBySearch, getProductsByCategory }
from '../services/api';

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {
      categoriesList: [],
      inputValue: '',
      productsArray: [],
      cart: [],
    };
  }

  fetchCategories = async () => {
    const data = await getCategories();
    this.setState({ categoriesList: data });
  }

  componentDidMount = () => {
    // const initialCart = [];
    // localStorage.setItem('cart', JSON.stringify(initialCart));
    this.fetchCategories();
    this.setState({ cart: JSON.parse(localStorage.getItem('cart')) || [] });
  }

  handleChange = ({ target }) => {
    const { name } = target;
    const { value } = target;
    this.setState({
      [name]: value,
    });
  }

  fetchProducts = async () => {
    const { inputValue } = this.state;
    const data = await getProductsBySearch(inputValue);
    this.setState({ productsArray: data.results });
  };

  fetchProductsByCategory = async (event) => {
    const data = await getProductsByCategory(event.target.name);
    this.setState({ productsArray: data.results });
  };

  handleCart = (event) => {
    const { productsArray } = this.state;
    const product = productsArray.find((elem) => elem.id === event.target.name);
    let array = [];
    const storage = localStorage.getItem('cart');
    if (storage === null) {
      array.push(product);
      localStorage.setItem('cart', JSON.stringify(array));
    } else {
      array = JSON.parse(localStorage.getItem('cart'));
      array.push(product);
      localStorage.setItem('cart', JSON.stringify(array));
    }
    this.setState({ cart: JSON.parse(localStorage.getItem('cart')) });
  }

  render() {
    const { categoriesList, productsArray, cart } = this.state;
    return (
      <div>
        <form>
          <input
            name="inputValue"
            onChange={ this.handleChange }
            type="text"
            data-testid="query-input"
          />
          <p data-testid="home-initial-message">
            Digite algum termo de pesquisa ou escolha uma categoria.
          </p>

          <button onClick={ this.fetchProducts } type="button" data-testid="query-button">
            PESQUISAR
          </button>
        </form>
        <Link
          to={ {
            pathname: '/cart',
            state: { cart },
          } }
          data-testid="shopping-cart-button"
        >
          Carrinho
        </Link>
        <p data-testid="shopping-cart-size">{cart.length}</p>
        <ul>
          {
            categoriesList.map((item) => (
              <div key={ item.id }>
                <button
                  onClick={ this.fetchProductsByCategory }
                  data-testid="category"
                  type="button"
                  name={ item.id }
                >
                  { item.name }
                </button>
              </div>))
          }
        </ul>
        {productsArray.length !== 0 ? productsArray.map((elem, index) => (
          <div
            key={ index }
            data-testid="product"
          >
            <Link
              to={ { pathname: '/product-details', state: { elem, cart } } }
              key={ elem.id }
              data-testid="product-detail-link"
            >
              <p>
                { elem.title }
              </p>

              <img alt="Foto do Produto" src={ elem.thumbnail } />

              <p>
                { elem.price }
              </p>
            </Link>

            <p>
              { elem.shipping.free_shipping
                ? (
                  <div data-testid="free-shipping">
                    Frete grátis!
                  </div>)
                : (
                  <div>
                    Frete 200 real
                  </div>)}
            </p>

            <button
              name={ elem.id }
              data-testid="product-add-to-cart"
              onClick={ this.handleCart }
              type="button"
            >
              Adicionar ao Carrinho!
            </button>
          </div>
        )) : <p>Nenhum produto foi encontrado</p>}
      </div>
    );
  }
}

ProductList.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default ProductList;
