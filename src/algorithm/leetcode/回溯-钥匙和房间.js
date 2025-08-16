/**
 * 题目：
 * 回溯-钥匙和房间
 * 
 */
function canVisitAllRooms(rooms) {
  const { length } = rooms;
  const dfs = (index, cach = new Set()) => {
    if (cach.has(index)) return cach;
    cach.add(index);
    const finds = rooms[index];
    finds.forEach(key => dfs(key, cach));
    return cach;
  };
  return dfs(0).size === length;
};