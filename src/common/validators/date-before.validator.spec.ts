import { validate } from 'class-validator';
import { IsDateString } from 'class-validator';
import { IsBeforeOrEqualTo } from './date-before.validator';

class TestDto {
  @IsDateString()
  @IsBeforeOrEqualTo('endDate')
  startDate: string;

  @IsDateString()
  endDate: string;
}

describe('IsBeforeOrEqualTo validator', () => {
  it('should pass when dates are equal', async () => {
    const dto = new TestDto();
    dto.startDate = '2024-08-22';
    dto.endDate = '2024-08-22';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass when startDate < endDate', async () => {
    const dto = new TestDto();
    dto.startDate = '2024-08-20';
    dto.endDate = '2024-08-22';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when startDate > endDate', async () => {
    const dto = new TestDto();
    dto.startDate = '2024-08-25';
    dto.endDate = '2024-08-22';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('IsBeforeOrEqualTo');
  });

  it('should pass when either date is missing (null-safe)', async () => {
    const dto = new TestDto();
    dto.startDate = undefined as any;
    dto.endDate = '2024-08-22';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
  });
});
