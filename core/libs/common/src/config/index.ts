import { readFileSync, existsSync } from 'fs';
import { ConfigService as NestConfigService } from '@nestjs/config';
import * as yaml from 'js-yaml';

export class ConfigService extends NestConfigService {}

const YAML_CONFIG_FILENAME_DEVELOPMENT = 'config.development.yml';
const YAML_CONFIG_FILENAME_STAGING = 'config.staging.yml';
const YAML_CONFIG_FILENAME_PRODUCTION = 'config.production.yml';

const getConfigFileName = () => {
  if (existsSync(YAML_CONFIG_FILENAME_DEVELOPMENT)) return YAML_CONFIG_FILENAME_DEVELOPMENT;
  if (existsSync(YAML_CONFIG_FILENAME_STAGING)) return YAML_CONFIG_FILENAME_STAGING;
  if (existsSync(YAML_CONFIG_FILENAME_PRODUCTION)) return YAML_CONFIG_FILENAME_PRODUCTION;
  return 'config.yml';
};

export const config = () => {
  return yaml.load(readFileSync(getConfigFileName(), 'utf8')) as object;
};
