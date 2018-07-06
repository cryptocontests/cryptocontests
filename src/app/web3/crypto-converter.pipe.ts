import { Pipe, PipeTransform } from '@angular/core';
import { CryptoValue, Currency, Fiat } from './transaction.model';
import { CurrencyService } from './services/currency.service';

@Pipe({
  name: 'cryptoConvert'
})
export class CryptoConverterPipe implements PipeTransform {
  constructor(private currencyService: CurrencyService) {}

  transform(value: CryptoValue, showCurrency?: Currency): number {
    return this.currencyService.convertCurrency(value, showCurrency);
   }
}
