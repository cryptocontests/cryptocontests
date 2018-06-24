import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cryptoConvert'
})
export class CryptoConverterPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return null;
  }
}
