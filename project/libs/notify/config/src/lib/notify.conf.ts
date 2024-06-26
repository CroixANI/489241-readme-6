import { ConfigType, registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';

import { NotifyConfigurationPorts, NotifyConfigurationRegistrationKey } from './notify.const';
import { NotifyEnvironmentConfiguration } from './notify.env'

async function getNotifyConfig(): Promise<NotifyEnvironmentConfiguration> {
  const config = plainToClass(NotifyEnvironmentConfiguration, {
    environment: process.env.NOTIFY_ENVIRONMENT,
    port: process.env.NOTIFY_PORT ? parseInt(process.env.NOTIFY_PORT, 10) : NotifyConfigurationPorts.DEFAULT_NOTIFY_PORT,
  });
  await config.validate();

  return config;
}

export default registerAs(NotifyConfigurationRegistrationKey, async (): Promise<ConfigType<typeof getNotifyConfig>> => {
  return getNotifyConfig();
});
