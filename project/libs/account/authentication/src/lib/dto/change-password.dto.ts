import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from 'class-validator';

import { UserPropertiesDescription, UserPropertiesValidationErrors } from "../rdo/user.constants";
import { PasswordLimits } from "../authentication.constants";

export class ChangePasswordDto {
  @ApiProperty({
    description: UserPropertiesDescription.Password,
    required: true,
    example: 'secret password!'
  })
  @IsString()
  @MinLength(PasswordLimits.Min, { message: UserPropertiesValidationErrors.MinPasswordLength })
  @MaxLength(PasswordLimits.Max, { message: UserPropertiesValidationErrors.MaxPasswordLength })
  public password: string;

  @ApiProperty({
    description: UserPropertiesDescription.Password,
    required: true,
    example: 'secret password!'
  })
  @IsString()
  @MinLength(PasswordLimits.Min, { message: UserPropertiesValidationErrors.MinPasswordLength })
  @MaxLength(PasswordLimits.Max, { message: UserPropertiesValidationErrors.MaxPasswordLength })
  public newPassword: string;
}
