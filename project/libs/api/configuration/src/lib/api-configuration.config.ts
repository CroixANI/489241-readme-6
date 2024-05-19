import { ConfigType, registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';

import { ApiConfigurationPorts, ApiConfigurationRegistrationKey, ApiHttpClientRetries } from './api-configuration.const';
import { ApiEnvironmentConfiguration } from './api-configuration.env';

async function getApiConfig(): Promise<ApiEnvironmentConfiguration> {
  const config = plainToClass(ApiEnvironmentConfiguration, {
    environment: process.env.API_ENVIRONMENT,
    port: process.env.API_PORT ? parseInt(process.env.API_PORT, 10) : ApiConfigurationPorts.DEFAULT_API_PORT,
    baseBlogUrl: process.env.BASE_BLOG_URL,
    baseAccountUrl: process.env.BASE_ACCOUNT_URL,
    baseNotifyUrl: process.env.BASE_NOTIFY_URL,
    httpClientTimeout: process.env.HTTP_CLIENT_TIMEOUT ? parseInt(process.env.HTTP_CLIENT_TIMEOUT, 10) : ApiHttpClientRetries.DEFAULT_TIMEOUT,
    httpClientMaxRedirects: process.env.HTTP_CLIENT_MAX_REDIRECTS ? parseInt(process.env.HTTP_CLIENT_MAX_REDIRECTS, 10) : ApiHttpClientRetries.DEFAULT_MAX_REDIRECTS,
  });

  await config.validate();

  return config;
}

export default registerAs(ApiConfigurationRegistrationKey, async (): Promise<ConfigType<typeof getApiConfig>> => {
  return getApiConfig();
});
