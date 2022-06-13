import { useEffect, useState } from 'react';
import { getСurrencies } from './api/api';
import {TextField, Autocomplete, Box} from '@mui/material';
import exchange from './assets/img/exchange.png.opdownload';

import './App.scss';

function App() {
  const [exchangeRates, setExchangeRates] = useState();
  const [rates, setRates] = useState({ UAH: 1, USD: '', EUR: '' });
  const [changeCurrency, setChangeCurrency] = useState({
    value: '',
    currency: 'UAH',
  });
  const [getCurrency, setGetCurrency] = useState({
    value: '',
    currency: 'USD',
  });

  const addZero = (num) => {
    if (num < 10) {
      return '0' + num;
    } else return num;
  };

  const today = () => {
    const date = new Date();
    const day = addZero(date.getDate());
    const month = addZero(date.getMonth() + 1);
    const year = date.getFullYear();

    return [day, month, year];
  };

  useEffect(() => {
    getСurrencies().then((res) => {
      const cur_arr = res.data.filter(
        (el) => el.ccy === 'USD' || el.ccy === 'EUR'
      );
      setExchangeRates(cur_arr);
      cur_arr.forEach((elem) => {
        switch (elem.ccy) {
          case 'USD':{
            return setRates((prev) => ({ ...prev, USD: elem.buy }));
          }
          case 'EUR':{
            return setRates((prev) => ({ ...prev, EUR: elem.buy }));
          }
          default: return;
        }
      });
    });
  }, []);

  const handelChangeFirstInput = (e) => {
    setChangeCurrency((prev) => ({ ...prev, value: e.target.value }));
    converter(
      e.target.value,
      null,
      changeCurrency.currency,
      getCurrency.currency
    );
  };

  const handelChangeFirstSelect = (e, value) => {
    setChangeCurrency((prev) => ({ ...prev, currency: value }));
    converter(changeCurrency.value, null, value, getCurrency.currency);
  };

  const handelChangeSecondInput = (e) => {
    setGetCurrency((prev) => ({ ...prev, value: e.target.value }));
    converter(
      null,
      e.target.value,
      changeCurrency.currency,
      getCurrency.currency
    );
  };

  const handelChangeSecondSelect = (e, value) => {
    setGetCurrency((prev) => ({ ...prev, currency: value }));
    converter(changeCurrency.value, null, changeCurrency.currency, value);
  };

  const converter = (firstValue, secondValue, firstSelect, secondSelect) => {
    if (firstSelect && secondSelect) {
      if (firstValue === '') {
        return setGetCurrency((prev) => ({ ...prev, value: '' }));
      }
      if (secondValue === '') {
        return setChangeCurrency((prev) => ({ ...prev, value: '' }));
      }

      let z = 0;
      if (firstSelect === secondSelect) {
        if (firstValue) {
          return setGetCurrency((prev) => ({ ...prev, value: firstValue }));
        }
        if (secondValue) {
          return setChangeCurrency((prev) => ({ ...prev, value: secondValue }));
        }
      } else {
        if (firstValue) {
          if (firstSelect !== 'UAH') {
            z = firstValue * rates[firstSelect];
            return setGetCurrency((prev) => ({
              ...prev,
              value: Math.ceil((z / rates[secondSelect]) * 100) / 100,
            }));
          } else {
            return setGetCurrency((prev) => ({
              ...prev,
              value: Math.ceil((firstValue / rates[secondSelect]) * 100) / 100,
            }));
          }
        }
        if (secondValue) {
          z = secondValue * rates[secondSelect];
          return setChangeCurrency((prev) => ({
            ...prev,
            value: Math.ceil((z / rates[firstSelect]) * 100) / 100,
          }));
        } else {
          return setChangeCurrency((prev) => ({
            ...prev,
            value: Math.ceil((secondValue / rates[firstSelect]) * 100) / 100,
          }));
        }
      }
    }
  };

  const list_currency = ['UAH', 'USD', 'EUR'];

  return (
    <div className="wrapper">
      <div className="header">
        <div className="container">
          <div className="header__rates">
            <div className="header__date">
              Курс валют актуальный на
              {`  ${today()[0]}.${today()[1]}.${today()[2]}`}
            </div>
            {exchangeRates?.map((elem) => {
              return (
                <div className="header__rate" key={elem.ccy}>
                  <div className="header__title">{elem.ccy} </div>
                  <div className="header__items">
                    {elem.buy}/{elem.sale}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="main">
        <div className="main__container">
          <div className="main__converter">
            <div className="main__title">Меняю</div>
            <div className="main__wrap">
              <Box
                component="form"
                sx={{
                  '& > :not(style)': { m: 1, width: '25ch' },
                }}
              >
                <TextField
                  inputProps={{ min: 0 }}
                  id="outlined-basic"
                  label="Enter the number"
                  variant="outlined"
                  type="number"
                  className="input"
                  value={changeCurrency.value}
                  onChange={handelChangeFirstInput}
                />
              </Box>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={list_currency}
                sx={{ width: 200 }}
                renderInput={(params) => <TextField {...params} />}
                value={changeCurrency.currency}
                onChange={handelChangeFirstSelect}
                getOptionLabel={(option) => option || ''}
              />
            </div>
          </div>
          <img src={exchange} alt="Exchange"/>
          <div className="main__converter">
            <div className="main__title">Получаю</div>
            <div className="main__wrap">
              <Box
                component="form"
                sx={{
                  '& > :not(style)': { m: 1, width: '25ch' },
                }}
              >
                <TextField
                  inputProps={{ min: 0 }}
                  id="outlined-basic"
                  label="Enter the number"
                  variant="outlined"
                  type="number"
                  className="input"
                  value={getCurrency.value}
                  onChange={handelChangeSecondInput}
                />
              </Box>

              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={list_currency}
                sx={{ width: 200 }}
                renderInput={(params) => <TextField {...params} />}
                value={getCurrency.currency}
                onChange={handelChangeSecondSelect}
                getOptionLabel={(option) => option || ''}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
