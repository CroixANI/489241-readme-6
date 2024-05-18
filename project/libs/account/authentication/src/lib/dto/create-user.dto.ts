import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsISO8601, IsString, MaxLength, MinLength } from 'class-validator';

import { UserPropertiesDescription, UserPropertiesValidationErrors } from "../rdo/user.constants";
import { PasswordLimits } from "../authentication.constants";

export class CreateUserDto {
  @ApiProperty({
    description: UserPropertiesDescription.Email,
    required: true,
    example: 'john.doe@noname.corp'
  })
  @IsEmail({}, { message: UserPropertiesValidationErrors.EmailNotValid })
  public email: string;

  @ApiProperty({
    description: UserPropertiesDescription.DateOfBirth,
    required: true,
    example: '1981-01-30'
  })
  @IsISO8601({}, { message: UserPropertiesValidationErrors.DateBirthNotValid })
  public dateBirth: string;

  @ApiProperty({
    description: UserPropertiesDescription.FirstName,
    required: true,
    example: 'John'
  })
  @IsString()
  @MinLength(3, { message: UserPropertiesValidationErrors.MinNameLength })
  @MaxLength(50, { message: UserPropertiesValidationErrors.MaxNameLength })
  public firstName: string;

  @ApiProperty({
    description: UserPropertiesDescription.LastName,
    required: true,
    example: 'Doe'
  })
  @IsString()
  @MinLength(3, { message: UserPropertiesValidationErrors.MinNameLength })
  @MaxLength(50, { message: UserPropertiesValidationErrors.MaxNameLength })
  public lastName: string;

  @ApiProperty({
    description: UserPropertiesDescription.Password,
    required: true,
    example: 'secret password!'
  })
  @IsString()
  @MinLength(PasswordLimits.Min, { message: UserPropertiesValidationErrors.MinPasswordLength })
  @MaxLength(PasswordLimits.Max, { message: UserPropertiesValidationErrors.MaxPasswordLength })
  public password: string;
}
