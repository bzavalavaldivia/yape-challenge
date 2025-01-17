import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GenericResponseDto } from 'src/accounts/domain/dto/generic-response.dto';
import { UpdateAccountRequestDto } from 'src/accounts/domain/dto/update-account-request.dto';
import { Account } from 'src/accounts/domain/entity/account';
import { DocumentType } from 'src/accounts/domain/entity/identification';
import { AccountRepository } from 'src/accounts/domain/repository/account-repository';
import { UpdateAccount } from 'src/accounts/domain/use-case/update-account';

@Injectable()
export class UpdateAccountImpl implements UpdateAccount {
  public constructor(
    @Inject('ACCOUNT_REPOSITORY')
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(
    userId: string,
    dto: UpdateAccountRequestDto,
  ): Promise<GenericResponseDto> {
    try {
      const account: Partial<Account> = {
        email: dto.email,
        phone: dto.phone,
        identification: {
          firstName: dto.firstName as string,
          lastName: dto.lastName as string,
          documentType: dto.documentType as DocumentType,
          documentNumber: dto.documentNumber as string,
        },
        status: dto.status,
      };
      await this.accountRepository.updateAccount(userId, account);

      return GenericResponseDto.builder()
        .message('Account updated successfully')
        .build();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
