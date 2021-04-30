import { Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { State } from '../types';
import { CODE } from '../const';
import Project, { IProject } from '../models/project';

@Injectable()
export class ProjectService {
  async create(project: Partial<IProject>): Promise<State> {
    try {
      project.id = hashSync(project.name, 10);
      const data = await Project.create(project);
      return { code: CODE.SUCCESS, data };
    } catch ({ message }) {
      return { code: CODE.FAIL, message };
    }
  }

  async delete(id: string): Promise<State> {
    try {
      const data = await Project.deleteOne({ id });
      return { code: CODE.SUCCESS, data };
    } catch ({ message }) {
      return { code: CODE.FAIL, message };
    }
  }

  async queryByProjectId(id: string): Promise<State> {
    try {
      const data = await Project.findOne({ id });
      return { code: CODE.SUCCESS, data };
    } catch ({ message }) {
      return { code: CODE.FAIL, message };
    }
  }

  async queryList(limit: number, offset: number): Promise<State> {
    try {
      limit = limit || 10;
      offset = offset || 0;
      const list = await Project.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(limit * offset)
        .exec();
      return { code: CODE.SUCCESS, data: list };
    } catch ({ message }) {
      return { code: CODE.FAIL, message };
    }
  }
}
