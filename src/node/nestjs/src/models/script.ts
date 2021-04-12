import { model, Schema, Document } from 'mongoose';
import { STATE } from '../const/index';

/**
 * Type
 */
export interface IScript extends Document {
  id: string;
  name: string;
  biz: string;
  projectId: string;
  creator: string;
  editors: string[];
  lines: string[];
  state: number;
  createdAt: Date;
}

/**
 * Schema
 */
const ScriptSchema = new Schema({
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  biz: { type: String, default: '' },
  projectId: { type: String, default: '' },
  creator: { type: String, default: '' },
  lines: { type: Array, default: [] },
  editors: { type: Array, default: [] },
  state: { type: Number, default: STATE.STATIC },
  createdAt: { type: Date, default: Date.now() },
});

/**
 * Validations
 */
ScriptSchema.path('name').validate(function (name) {
  return name.length;
}, 'Name cannot be blank');

/**
 * Pre-save hook
 */
ScriptSchema.pre(/^save$/, function (this: IScript, next) {
  if (!this.name) {
    next(new Error('Invalid script name'));
  } else {
    next();
  }
});

export default model<IScript>('Script', ScriptSchema);
