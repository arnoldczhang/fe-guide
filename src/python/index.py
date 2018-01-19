import httplib, json, re, sys
from urllib import urlencode


# common methods
def func(res):
  return res

def to_json(str, encoding="utf-8"):
  return json.loads(str.decode(), encoding)

def filter(str):
  other_tag = re.compile(r"(?:^[^\(\)]+\(|\)\;?\n?$)")
  return other_tag.sub('', str)

def config_sys_info():
  reload(sys)
  sys.setdefaultencoding('utf8')
  base_path = sys.argv[1] or './src/python/'
  return {
    "base_path": base_path
  }

# global varible
OPTIONS = {
  "callback": func,
  "file_name": '',
  "req_data": {}
}

class Crawler(object):
  def __init__(self, param):
    self.base_path = param['base_path']
    self.sina_crawler()
    self.net_ease_crawler()
    self.sohu_crawler()
    self.tencent_crawler()

  def tencent_crawler(self):
    host = 'xw.qq.com'
    file_name = '%s%s' % (self.base_path, 'tecent.json')
    return self.ajax(host, 'http://%s/public-api/feed?scene=CHANNEL&sceneId=8&page=1&size=20&callback=jQuery321027075685780325864_1516331283536&_=1516331283544' % (host), {
      "file_name": file_name,
      "req_data": {}
    })

  def sohu_crawler(self):
    host = 'v2.sohu.com'
    file_name = '%s%s' % (self.base_path, 'sohu.json')
    return self.ajax(host, 'http://%s/public-api/feed?scene=CHANNEL&sceneId=8&page=1&size=20&callback=jQuery321027075685780325864_1516331283536&_=1516331283544' % (host), {
      "file_name": file_name,
      "req_data": {}
    })

  def net_ease_script(self, res):
    script_match = re.compile(r"<script src\=\"(https?://(static\.ws\.126\.net)/f2e/wap/touch_index_\d{4}/trunk/js/newaplib\.[^\.]+\.\d+\.js)\"></script>").search(res)
    if script_match:
      return {
        "url": script_match.group(1),
        "host": script_match.group(2)
      }
    return False

  def net_ease_script_cb(self, res):
    print res
    script_match = re.compile(r"function\(\)\{\s?\"use strict\";\s?var e=(.+);this\._channelMap\=e\}\.call\(window\.NEWAP\)").search(res)
    if script_match:
      print script_match.group(1)

  def net_ease_html_cb(self, res):
    param = self.net_ease_script(res)
    if param:
      self.ajax(param["host"], param["url"], {
        "callback": self.net_ease_script_cb
      })
    else:
      print 'fail'

  def net_ease_crawler(self):
    host = '3g.163.com';
    file_name = '%s%s' % (self.base_path, 'netease.json')
    #
    # return self.ajax(host, 'https://%s/touch/news/subchannel/all?dataversion=A&uversion=A&version=v_standard' % (host), {
    #   "callback": self.net_ease_html_cb
    # })
    return self.ajax(host, 'https://%s/touch/reconstruct/article/list/BCR0CBQ2wangning/0-10.html' % (host), {
      "file_name": file_name,
      "req_data": {}
    })

  def sina_crawler(self):
    host = 'cre.dp.sina.cn'
    file_name = '%s%s' % (self.base_path, 'sina.json')
    return self.ajax(host, 'https://%s/api/v3/get?cateid=1o&cre=tianyi&mod=wnews&merge=3&statics=1&length=20&tm=1489716199&ad={"rotate_count":7916,"page_url":"https://news.sina.cn/?vt=4&pos=108&his=0","channel":"131250","platform":"wap","timestamp":1516182689381,"net":null}&action=0&up=0&down=0&length=18&_=1516182689394&callback=Zepto1516182689335' % (host), {
      "file_name": file_name,
      "req_data": {}
    })

  def ajax(self, req_host, req_url, options = OPTIONS):
      conn = httplib.HTTPConnection(req_host)
      has_req_data = "req_data" in options
      conn.request("GET", req_url, urlencode((has_req_data and options["req_data"]) or {}))
      response = conn.getresponse()
      res = filter(response.read())
      conn.close()
      if "callback" in options:
        options["callback"](res)
      if res and ("file_name" in options):
        json_str = to_json(res)
        f = open(options["file_name"], 'w')
        f.write(json.dumps(json_str, indent = 4, ensure_ascii=False))
        f.close()

param = config_sys_info()
# print param
Crawler(param)
