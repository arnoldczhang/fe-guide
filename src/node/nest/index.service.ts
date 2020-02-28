import { Injectable } from '@nestjs/common';
import { Index } from './interfaces/index.interface';

@Injectable()
export class IndexService {
  private readonly indexs: Index[] = [];

  create(index: Index) {
    this.indexs.push(index);
  }

  findAll(): Index[] {
    return this.indexs;
  }
}