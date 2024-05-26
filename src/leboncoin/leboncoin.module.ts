// src/leboncoin/leboncoin.module.ts
import { Module } from '@nestjs/common';
import { LeboncoinService } from './leboncoin.service';

@Module({
  providers: [LeboncoinService],
  exports: [LeboncoinService],
})
export class LeboncoinModule {}
