import AbstractService from './AbstractService';

export default abstract class AbstractServiceV2 extends AbstractService {
  /**
   * 适配查询
   *
   * 用于在通用查询之前做统一的where条件适配
   *
   * 注：请在实体类中具体实现
   *
   */
  abstract adaptQuery(...args: any[]): string;
}
