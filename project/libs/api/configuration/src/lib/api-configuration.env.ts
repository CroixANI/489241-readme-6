import { IsEnum, IsNumber, IsOptional, IsString, Max, Min, validateOrReject } from 'class-validator';

import { Environments } from '@project/shared-core';
import { ApiConfigurationPorts, ApiConfigurationErrors, BlogEndpoints, AccountEndpoints, NotifyEndpoints } from './api-configuration.const';

export class ApiEnvironmentConfiguration {
  @IsString({ message: ApiConfigurationErrors.EnvironmentRequired })
  @IsEnum(Environments, { message: ApiConfigurationErrors.EnvironmentIsIncorrect })
  public environment: Environments;

  @IsNumber({}, { message: ApiConfigurationErrors.PortRequired })
  @Min(ApiConfigurationPorts.MIN_PORT)
  @Max(ApiConfigurationPorts.MAX_PORT)
  @IsOptional()
  public port: number = ApiConfigurationPorts.DEFAULT_API_PORT;

  @IsString({ message: ApiConfigurationErrors.BlogBaseUrlRequired })
  public baseBlogUrl: string;

  @IsString({ message: ApiConfigurationErrors.AccountBaseUrlRequired })
  public baseAccountUrl: string;

  @IsString({ message: ApiConfigurationErrors.NotifyBaseUrlRequired })
  public baseNotifyUrl: string;

  @IsNumber({}, { message: ApiConfigurationErrors.HttpClientTimeoutIsRequired })
  public httpClientTimeout: number;

  @IsNumber({}, { message: ApiConfigurationErrors.HttpClientMaxRedirectsIsRequired })
  public httpClientMaxRedirects: number;

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }

  public getBlogUrl(blogEndpoint: BlogEndpoints): string {
    return `${this.baseBlogUrl}/${blogEndpoint}`
  }

  public getAccountUrl(accountEndpoint: AccountEndpoints): string {
    return `${this.baseAccountUrl}/${accountEndpoint}`
  }

  public getNotifyUrl(notifyEndpoint: NotifyEndpoints) {
    return `${this.baseNotifyUrl}/${notifyEndpoint}`
  }
}
