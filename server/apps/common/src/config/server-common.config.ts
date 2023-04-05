import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import * as yaml from 'js-yaml';

const YAML_CONFIG_FILENAME_DEVELOPMENT = 'config.development.yml';
const YAML_CONFIG_FILENAME_STAGING = 'config.staging.yml';
const YAML_CONFIG_FILENAME_PRODUCTION = 'config.production.yml';

const getConfigFileName = () => {
  if (existsSync(resolve(__dirname, '..', '..', YAML_CONFIG_FILENAME_DEVELOPMENT)))
    return YAML_CONFIG_FILENAME_DEVELOPMENT;
  if (existsSync(resolve(__dirname, '..', '..', YAML_CONFIG_FILENAME_STAGING)))
    return YAML_CONFIG_FILENAME_STAGING;
  if (existsSync(resolve(__dirname, '..', '..', YAML_CONFIG_FILENAME_PRODUCTION)))
    return YAML_CONFIG_FILENAME_PRODUCTION;
  return 'config.yml';
};

export const config = () => {
  return yaml.load(
    readFileSync(resolve(__dirname, '..', '..', getConfigFileName()), 'utf8')
  ) as object;
};
