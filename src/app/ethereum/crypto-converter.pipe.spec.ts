import { CryptoConverterPipe } from './crypto-converter.pipe';

describe('CryptoConverterPipe', () => {
  it('create an instance', () => {
    const pipe = new CryptoConverterPipe();
    expect(pipe).toBeTruthy();
  });
});
