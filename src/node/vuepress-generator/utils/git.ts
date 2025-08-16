import childProcess from 'child_process';

const exec = (cmd: string) => childProcess
  .execSync(cmd, { encoding: 'utf8' })
  .toString()
  .trim();

/**
 * 获取文件历史提交作者
 * @param root
 * @param filePath
 */
export const getAuthor = (
  root: string,
  filePath: string,
): string => {
  try {
    return exec(`git -C ${root} log --pretty=format:%an ${filePath}`);
  } catch (e) {
    return '';
  }
};

