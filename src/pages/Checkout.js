import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

class Checkout extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      cpf: '',
      phone: '',
      cep: '',
      address: '',
      payment: '',
      error: false,
      redirect: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleValidation() {
    const { name, email, cpf, phone, cep, address, payment } = this.state;
    return !(name && email && cpf && phone && cep && address && payment);
    //
  }

  handleSubmit() {
    const { name, email, cpf, phone, cep, address, payment } = this.state;
    if (!(name && email && cpf && phone && cep && address && payment)) {
      this.setState({ error: true });
    } else {
      localStorage.setItem('cart', JSON.stringify([]));
      this.setState({ error: false, redirect: true });
    }
  }

  render() {
    const { location: { state: { newCart } } } = this.props;
    const { error, redirect } = this.state;
    return (
      <div>
        Checkout
        {newCart.map((elem, i) => <div key={ i }>{elem.title}</div>)}
        <form>
          <legend>Name:</legend>
          <input
            data-testid="checkout-fullname"
            type="text"
            onChange={ this.handleChange }
            name="name"
          />
          <legend>Email:</legend>
          <input
            data-testid="checkout-email"
            type="text"
            onChange={ this.handleChange }
            name="email"
          />
          <legend>CPF:</legend>
          <input
            data-testid="checkout-cpf"
            type="text"
            onChange={ this.handleChange }
            name="cpf"
          />
          <legend>Telefone:</legend>
          <input
            data-testid="checkout-phone"
            type="text"
            onChange={ this.handleChange }
            name="phone"
          />
          <legend>CEP:</legend>
          <input
            data-testid="checkout-cep"
            type="text"
            onChange={ this.handleChange }
            name="cep"
          />
          <legend>Endereco:</legend>
          <input
            data-testid="checkout-address"
            type="text"
            onChange={ this.handleChange }
            name="address"
          />
          <div>
            Pagamento:
            <legend>Boleto</legend>
            <input
              data-testid="ticket-payment"
              type="radio"
              value="boleto"
              name="payment"
              onChange={ this.handleChange }
            />
            <legend>Visa</legend>
            <input
              data-testid="visa-payment"
              type="radio"
              value="visa"
              name="payment"
              onChange={ this.handleChange }
            />
            <legend>MasterCard</legend>
            <input
              data-testid="master-payment"
              type="radio"
              value="master"
              name="payment"
              onChange={ this.handleChange }
            />
            <legend>Elo</legend>
            <input
              data-testid="elo-payment"
              type="radio"
              value="elo"
              name="payment"
              onChange={ this.handleChange }
            />
          </div>
        </form>
        <button
          data-testid="checkout-btn"
          type="button"
          onClick={ this.handleSubmit }
        >
          Submit
        </button>
        {error && <div data-testid="error-msg">Campos inválidos</div>}
        {redirect && <Redirect to="/" /> }
      </div>
    );
  }
}

Checkout.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      newCart: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          price: PropTypes.number.isRequired,
          thumbnail: PropTypes.string.isRequired,
        }),
      ),
    }),
  }).isRequired,
};

export default Checkout;
