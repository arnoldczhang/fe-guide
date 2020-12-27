// eslint-disable-next-line no-unused-vars
import { Context } from 'koa';
import glob = require('glob');
import { getActions } from './controller/AbstractController';

interface route {
  path: string;
  method: 'get' | 'post' | 'patch' | 'put' | 'delete';
  action: (ctx: Context) => Promise<void>;
}

(function loadController() {
  const controllers = glob.sync('./controller/*Controller.js', {
    cwd: __dirname,
  });
  controllers.forEach(controller => {
    require(controller);
  });
})();

const routers: route[] = getActions().map(({ method, path, action }) => ({
  path,
  method,
  action,
}));

// const routers: route[] = [
//   {
//     path: '/demo',
//     method: 'get',
//     action: DemoController.demo,
//   },
//   {
//     path: '/auth',
//     method: 'post',
//     action: DemoController.auth,
//   },
//   {
//     path: '/dashboard/pv',
//     method: 'get',
//     action: AbstractController.handleRequest,
//   },
//   {
//     path: '/dashboard/uv',
//     method: 'get',
//     action: AbstractController.handleRequest,
//   },
//   {
//     path: '/dashboard/jserror',
//     method: 'get',
//     action: AbstractController.handleRequest,
//   },
//   {
//     path: '/dashboard/errorPVProportion',
//     method: 'get',
//     action: AbstractController.handleRequest,
//   },
//   {
//     path: '/dashboard/whiteScreen',
//     method: 'get',
//     action: AbstractController.handleRequest,
//   },
// ];

export default routers;
