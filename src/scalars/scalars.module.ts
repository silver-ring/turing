import { Module } from '@nestjs/common';
import { UrlScalar } from './url.scalar';
import { MapScalar } from './map.scalar';

@Module({
  providers: [UrlScalar, MapScalar],
})
export class ScalarsModule {}
