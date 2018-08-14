import { Injectable } from '@angular/core';
import {
  CryptoValue,
  Currency,
  CryptoCurrency,
  Fiat
} from '../transaction.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  apiUrl = 'https://api.coinmarketcap.com/v2/ticker/?convert=EUR&limit=10';
  conversions: any;

  constructor(private http: HttpClient) {
    this.http
      .get(this.apiUrl)
      .subscribe(response => (this.conversions = response));
  }

  public cryptoToFiat(value: CryptoValue, returnCurrency: Fiat): number {
    if (!this.conversions) return value.value;

    if (CryptoCurrency[value.currency] === CryptoCurrency.BTC) {
      return (
        this.conversions.data['1'].quotes[returnCurrency].price * value.value
      );
    } else if (CryptoCurrency[value.currency] === CryptoCurrency.ETH) {
      return (
        this.conversions.data['1027'].quotes[returnCurrency].price * value.value
      );
    } else if (CryptoCurrency[value.currency] === CryptoCurrency.WEIS) {
      return (
        this.conversions.data['1027'].quotes[returnCurrency].price *
        this.weisToEth(value.value)
      );
    }
    return value.value;
  }

  public weisToEth(value: number): number {
    return value / 1000000000000000000;
  }

  public ethToWeis(value: number): number {
    return value * 1000000000000000000;
  }

  public convertCurrency(value: CryptoValue, returnCurrency: Currency): number {
    if (Object.keys(Fiat).includes(returnCurrency)) {
      return this.cryptoToFiat(value, <Fiat>returnCurrency);
    } else if (
      CryptoCurrency[value.currency] === CryptoCurrency.ETH &&
      CryptoCurrency[returnCurrency] === CryptoCurrency.WEIS
    ) {
      return this.ethToWeis(value.value);
    } else if (
      CryptoCurrency[value.currency] === CryptoCurrency.WEIS &&
      CryptoCurrency[returnCurrency] === CryptoCurrency.ETH
    ) {
      return this.weisToEth(value.value);
    }
    return value.value;
  }
}
