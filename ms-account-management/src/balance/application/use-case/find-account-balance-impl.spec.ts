import { AccountBalanceRepository } from 'src/balance/domain/repository/account-balance.repository';
import { FindAccountBalanceImpl } from './find-account-balance-impl';
import { Test } from '@nestjs/testing';
import { AccountBalanceDto } from 'src/balance/domain/dto/account-balance.dto';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';

describe('FindAccountBalancempl', () => {
  let service: FindAccountBalanceImpl;
  let repository: AccountBalanceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindAccountBalanceImpl,
        {
          provide: 'ACCOUNT_BALANCE_REPOSITORY',
          useValue: {
            findAccountBalance: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FindAccountBalanceImpl>(FindAccountBalanceImpl);
    repository = module.get<AccountBalanceRepository>(
      'ACCOUNT_BALANCE_REPOSITORY',
    );
  });

  describe('execute', () => {
    it('should find an account balance', async () => {
      const accountBalanceId = uuidv4();

      const accountBalance = AccountBalanceDto.builder()
        .accountBalanceId(uuidv4())
        .amount(100)
        .build();

      (repository.findAccountBalance as jest.Mock).mockResolvedValueOnce(
        accountBalance,
      );

      const result: AccountBalanceDto = await service.execute(accountBalanceId);

      expect(result.accountBalanceId).toBe(accountBalance.accountBalanceId);
      expect(result.amount).toBe(accountBalance.amount);
    });

    it('should throw an error if account balance does not exist', async () => {
      const accountBalanceId = uuidv4();

      (repository.findAccountBalance as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.execute(accountBalanceId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
