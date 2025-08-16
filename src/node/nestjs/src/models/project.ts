import { model, Schema, Document } from 'mongoose';

/**
 * Type
 */
export interface IProject extends Document {
  id: string;
  name: string;
  biz: string;
  creator: string;
  editors: string[];
  state: string;
  createdAt: Date;
}

/**
 * Schema
 */
const ProjectSchema = new Schema({
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  biz: { type: String, default: '' },
  creator: { type: String, default: '' },
  editors: { type: Array, default: [] },
  state: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

/**
 * Validations
 */
ProjectSchema.path('name').validate(function (name) {
  return name.length;
}, 'Name cannot be blank');

/**
 * Pre-save hook
 */
ProjectSchema.pre(/^save$/, function (this: IProject, next) {
  if (!this.name) {
    next(new Error('Invalid project name'));
  } else {
    next();
  }
});

export default model<IProject>('Project', ProjectSchema);
