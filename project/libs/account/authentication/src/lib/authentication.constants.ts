export enum AuthenticationErrors {
  AuthUserExists = 'User with the email already exists',
  UserNotFound = 'User not found',
  WrongPassword = 'User password is wrong'
}

export enum PasswordLimits {
  Min = 6,
  Max = 12,
}

export enum AuthenticationResponseMessage {
  LoggedSuccess = 'User has been successfully logged',
  LoggedError = 'Password or Login is wrong',
  UserFound = 'User found and user details returned in body',
  UserCreated = 'The new user has been successfully created',
  PasswordUpdated = 'User password was updated',
  RefreshTokens = 'Returns new pair of access and refresh tokens',
  CheckToken = 'Returns verified user details',
}

export enum AuthenticationOperationDescription {
  Login = 'Verifies user password',
  GetById = 'Gets user details by id',
  Register = 'Registers user',
  ChangeUserPassword = 'Changes user password',
  RefreshTokens = 'Generates a new pair of access and refresh tokens',
  CheckToken = 'Verify user toke (for internal user only by API Gateway)',
}
