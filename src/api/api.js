import axios from 'axios';

export const getСurrencies = () => {
  return axios.get(
    'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5'
  );
};
