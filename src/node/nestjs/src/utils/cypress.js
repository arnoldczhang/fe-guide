/* eslint-disable @typescript-eslint/no-var-requires */
const cypress = require('cypress');
const { connect, disconnect, model, Schema } = require('mongoose');
const fs = require('fs');
const path = require('path');

const dddddddab = 'mongodb://localhost:27017/xxxxxxxx';
const STATE = {
  STATIC: 0,
  WAIT: 1,
  DISPATCH: 2,
};

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
  createdAt: { type: Date, default: Date.now },
  video: { type: String, default: '' },
  report: { type: String, default: '' },
});
const Script = model('Script', ScriptSchema);

const runTask = async () => {
  await connect(dddddddab, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // 中间做些什么事。。。
  disconnect(db);
};

runTask();
