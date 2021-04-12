import { FilterQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { State, ScriptState } from '../types';
import { CODE } from '../const';
import Script, { IScript } from '../models/script';

@Injectable()
export class ScriptService {
  async create(script: Partial<IScript>): Promise<State> {
    try {
      script.id = hashSync(script.name, 10);
      const data = await Script.create(script);
      return { code: CODE.SUCCESS, data };
    } catch ({ message }) {
      return { code: CODE.FAIL, message };
    }
  }

  async delete(id: string): Promise<State> {
    try {
      const data = await Script.deleteOne({ id });
      return { code: CODE.SUCCESS, data };
    } catch ({ message }) {
      return { code: CODE.FAIL, message };
    }
  }

  async queryByScriptId(id: string): Promise<State> {
    try {
      const data = await Script.findOne({ id });
      return { code: CODE.SUCCESS, data };
    } catch ({ message }) {
      return { code: CODE.FAIL, message };
    }
  }

  async queryOneByAny(script: FilterQuery<IScript>): Promise<State> {
    try {
      const data = await Script.findOne(script);
      return { code: CODE.SUCCESS, data };
    } catch ({ message }) {
      return { code: CODE.FAIL, message };
    }
  }

  async queryList(
    projectId: string,
    limit: number,
    offset: number,
  ): Promise<State> {
    try {
      limit = limit || 10;
      offset = offset || 0;
      const list = await Script.find({
        projectId,
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(limit * offset)
        .exec();
      return { code: CODE.SUCCESS, data: list };
    } catch ({ message }) {
      return { code: CODE.FAIL, message };
    }
  }

  async update(script: Partial<IScript>, state: ScriptState): Promise<State> {
    try {
      const data = await Script.updateOne(
        {
          id: script.id,
        },
        {
          $set: {
            state,
          },
        },
      );
      return { code: CODE.SUCCESS, data };
    } catch ({ message }) {
      return { code: CODE.FAIL, message };
    }
  }
}
