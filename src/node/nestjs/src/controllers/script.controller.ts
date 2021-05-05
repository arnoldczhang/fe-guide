import {
  Controller,
  Get,
  Delete,
  Post,
  Put,
  Bind,
  Body,
  Query,
} from '@nestjs/common';
import { ScriptService } from '../services/script.service';
import { IScript } from '../models/script';
import { State } from '../types';
import { STATE } from '../const/index';

@Controller('script')
export class ScriptController {
  constructor(private readonly scriptService: ScriptService) {}

  @Delete()
  @Bind(Body())
  async delete({ id }): Promise<State> {
    return await this.scriptService.delete(id);
  }

  @Put('/run')
  @Bind(Body())
  async update(script: IScript): Promise<State> {
    return await this.scriptService.update(script, STATE.WAIT);
  }

  @Post()
  @Bind(Body())
  async create(script: IScript): Promise<State> {
    return await this.scriptService.create(script);
  }

  @Get('/list')
  async findAll(
    @Query('projectId') projectId,
    @Query('limit') limit,
    @Query('offset') offset,
  ): Promise<State> {
    return await this.scriptService.queryList(projectId, limit, offset);
  }

  @Get()
  async findOne(@Query('id') id): Promise<State> {
    return await this.scriptService.queryByScriptId(id);
  }
}
