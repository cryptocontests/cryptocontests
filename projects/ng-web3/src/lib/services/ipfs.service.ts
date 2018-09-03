import { Injectable } from '@angular/core';
import bs58 from 'bs58';

declare function require(url: string);
const ipfsAPI = require('ipfs-api');

export interface FileReceipt {
  path: string;
  hash: string;
  size: number;
}

export type IpfsContent = Buffer | ReadableStream;

export interface IpfsFile {
  path: string;
  content: IpfsContent;
}

@Injectable({
  providedIn: 'root'
})
export class IpfsService {
  host = 'ipfs.infura.io';
  ipfs: any;

  constructor() {
    this.ipfs = ipfsAPI({ host: this.host, port: 5001, protocol: 'https' });
  }

  public add(
    data: IpfsContent | IpfsFile[],
    options: any = {}
  ): Promise<FileReceipt> {
    return this.ipfs.files.add(data, options);
  }

  public get(ipfsPath: string): Promise<IpfsFile> {
    return this.ipfs.files.get(ipfsPath);
  }

  // Return bytes32 hex string from base58 encoded ipfs hash,
  // stripping leading 2 bytes from 34 byte IPFS hash
  // Assume IPFS defaults: function:0x12=sha2, size:0x20=256 bits
  getBytes32FromIpfsHash(ipfsListing) {
    return (
      '0x' +
      bs58
        .decode(ipfsListing)
        .slice(2)
        .toString('hex')
    );
  }

  // Return base58 encoded ipfs hash from bytes32 hex string,
  getIpfsHashFromBytes32(bytes32Hex) {
    const hashHex = '1220' + bytes32Hex.slice(2);
    const hashBytes = Buffer.from(hashHex, 'hex');
    const hashStr = bs58.encode(hashBytes);
    return hashStr;
  }
}
