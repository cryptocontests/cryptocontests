import { TestBed, inject } from '@angular/core/testing';

import { EthereumServiceService } from './ethereum-service.service';

describe('EthereumServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EthereumServiceService]
    });
  });

  it('should be created', inject([EthereumServiceService], (service: EthereumServiceService) => {
    expect(service).toBeTruthy();
  }));
});
