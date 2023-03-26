import { readFileSync } from "fs";
import { join } from "path";
import { ConfigService as NestConfigService } from "@nestjs/config";
import * as yaml from "js-yaml";

const YAML_CONFIG_FILE_NAME = "config.yml";

export class ConfigService extends NestConfigService {}

export const config = () => {
  return yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILE_NAME), "utf8")
  ) as object;
};
