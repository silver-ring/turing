import { Module } from '@nestjs/common';
import { LoggerPlugin } from './logger.plugin';
import { ComplexityPlugin } from './complexity.plugin';

@Module({
  providers: [ComplexityPlugin, LoggerPlugin],
})
export class PluginsModule {}
