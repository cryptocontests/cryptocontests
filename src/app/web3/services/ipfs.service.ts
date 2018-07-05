import { Injectable } from '@angular/core';
import { IPFS } from 'ipfs-api';

export interface FileReceipt {
  path: string;
  hash: string;
  size: number;
}

export interface IpfsFile {
  path: string;
  content: Buffer;
}

@Injectable({
  providedIn: 'root'
})
export class IpfsService {

  host = 'ipfs.infura.io';
  ipfs: IPFS;

  constructor() {
    //this.ipfs = new IPFS({ host: this.host, port: 5001, protocol: 'https' });
  }

  public addFile(data: Buffer | ReadableStream, pin: boolean = true): Promise<FileReceipt> {
    return this.ipfs.files.add(data, { pin: pin });
  }

  public getFile(ipfsPath: string): Promise<IpfsFile> {
    return this.ipfs.files.get(ipfsPath);
  }
}
