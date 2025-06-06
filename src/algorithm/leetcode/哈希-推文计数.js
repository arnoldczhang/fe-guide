/**
 * 1348. 推文计数
 * 一家社交媒体公司正试图通过分析特定时间段内出现的推文数量来监控其网站上的活动。这些时间段可以根据特定的频率（ 每分钟 、每小时 或 每一天 ）划分为更小的 时间段 。
 * 例如，周期 [10,10000] （以 秒 为单位）将被划分为以下频率的 时间块 :
 * 
 * 每 分钟 (60秒 块)： [10,69], [70,129], [130,189], ..., [9970,10000]
 * 每 小时 (3600秒 块)：[10,3609], [3610,7209], [7210,10000]
 * 每 天 (86400秒 块)： [10,10000]
 * 注意，最后一个块可能比指定频率的块大小更短，并且总是以时间段的结束时间结束(在上面的示例中为 10000 )。
 * 
 * 设计和实现一个API来帮助公司进行分析。
 * 
 * 实现 TweetCounts 类:
 * 
 * TweetCounts() 初始化 TweetCounts 对象。
 * 存储记录时间的 tweetName (以秒为单位)。
 * List<integer> getTweetCountsPerFrequency(String freq, String tweetName, int startTime, int endTime) 返回一个整数列表，表示给定时间 [startTime, endTime] （单位秒）和频率频率中，每个 时间块 中带有 tweetName 的 tweet 的数量。
 * freq 是 “minute” 、 “hour” 或 “day” 中的一个，分别表示 每分钟 、 每小时 或 每一天 的频率。
 *  
 * 
 * 示例：
 * 
 * 输入：
 * ["TweetCounts","recordTweet","recordTweet","recordTweet","getTweetCountsPerFrequency","getTweetCountsPerFrequency","recordTweet","getTweetCountsPerFrequency"]
 * [[],["tweet3",0],["tweet3",60],["tweet3",10],["minute","tweet3",0,59],["minute","tweet3",0,60],["tweet3",120],["hour","tweet3",0,210]]
 * 
 * 输出：
 * [null,null,null,null,[2],[2,1],null,[4]]
 * 
 * 解释：
 * TweetCounts tweetCounts = new TweetCounts();
 * tweetCounts.recordTweet("tweet3", 0);
 * tweetCounts.recordTweet("tweet3", 60);
 * tweetCounts.recordTweet("tweet3", 10);                             // "tweet3" 发布推文的时间分别是 0, 10 和 60 。
 * tweetCounts.getTweetCountsPerFrequency("minute", "tweet3", 0, 59); // 返回 [2]。统计频率是每分钟（60 秒），因此只有一个有效时间间隔 [0,60> - > 2 条推文。
 * tweetCounts.getTweetCountsPerFrequency("minute", "tweet3", 0, 60); // 返回 [2,1]。统计频率是每分钟（60 秒），因此有两个有效时间间隔 1) [0,60> - > 2 条推文，和 2) [60,61> - > 1 条推文。 
 * tweetCounts.recordTweet("tweet3", 120);                            // "tweet3" 发布推文的时间分别是 0, 10, 60 和 120 。
 * tweetCounts.getTweetCountsPerFrequency("hour", "tweet3", 0, 210);  // 返回 [4]。统计频率是每小时（3600 秒），因此只有一个有效时间间隔 [0,211> - > 4 条推文。
 */

var TweetCounts = function() {
  this.frequencyMap = {
    minute: 69 - 10,
    hour: 3609 - 10,
    day: 86399,
  };
  this.cach = new Map();
};

const getIndex = (arr, num) => {
  let start = 0;
  let end = arr.length;
  while (start < end) {
    const mid = start + ((end - start) >> 1);
    if (arr[mid] < num) {
      start = mid + 1;
    } else {
      end = mid;
    }
  }
  return start;
}

/** 
 * @param {string} tweetName 
 * @param {number} time
 * @return {void}
 */
TweetCounts.prototype.recordTweet = function(tweetName, time) {
  if (this.cach.has(tweetName)) {
    const arr = this.cach.get(tweetName);
    const index = getIndex(arr, time);
    arr.splice(index, 0, time);
  } else {
    this.cach.set(tweetName, [time]);
  }
};

/** 
 * @param {string} freq 
 * @param {string} tweetName 
 * @param {number} startTime 
 * @param {number} endTime
 * @return {number[]}
 */
TweetCounts.prototype.getTweetCountsPerFrequency = function(freq, tweetName, startTime, endTime) {
  const result = [];
  const frequency = this.frequencyMap[freq];
  const tweet = this.cach.get(tweetName);
  let current = Math.min(startTime + frequency, endTime);
  while (current <= endTime) {
    const count = getIndex(tweet, current + 1) - getIndex(tweet, startTime);
    result.push(count);
    startTime = current + 1;
    if (startTime > endTime) break;
    current = Math.min(startTime + frequency, endTime);
  }
  return result;
};

/** 
 * Your TweetCounts object will be instantiated and called as such:
 * var obj = new TweetCounts()
 * obj.recordTweet(tweetName,time)
 * var param_2 = obj.getTweetCountsPerFrequency(freq,tweetName,startTime,endTime)
 */