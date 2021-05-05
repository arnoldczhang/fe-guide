import {
  Controller,
  Get,
  Delete,
  Post,
  Bind,
  Body,
  Query,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { IProject } from '../models/project';
import { State } from '../types';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Delete()
  @Bind(Body())
  async delete({ id }): Promise<State> {
    return await this.projectService.delete(id);
  }

  @Post()
  @Bind(Body())
  async create(project: IProject): Promise<State> {
    return await this.projectService.create(project);
  }

  @Get('/list')
  async findAll(
    @Query('limit') limit,
    @Query('offset') offset,
  ): Promise<State> {
    return await this.projectService.queryList(limit, offset);
  }

  @Get()
  async findOne(@Query('id') id): Promise<State> {
    return await this.projectService.queryByProjectId(id);
  }
}
