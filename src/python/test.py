import requests, sys, wx, xlrd
from pyquery import PyQuery as pq
from tkinter import *
from xlwt import *

KEY_MAP = {
  "project_name": 2,
  "project_url": 3,
  "actual_url": 5,
  "province": 9,
  "operator": 10,
  "os": 11,
  "container": 12,
  "network": 13,
  "ua": 14,
  "ip": 16,
  "error": 17,
}

def config_sys_info():
  return {
    "map": KEY_MAP,
    "path_name": ".",
    "cookie": {
      "ace_settings": "%7B%22sidebar-collapsed%22%3A-1%7D",
      "JSESSIONID": "8476660241D253FDBDB5501410804D3C",
      "ssoid": "bcf40a5d6f*c4e8093d3868c1d9e5330",
      "FRONTEND_DATE": "2018-01-26",
      "FRONTEND_PROJECT": "takeaway-wxwallet",
      "ct": "zhangcheng17|zhangcheng17|1516959750772|127.0.0.1|665582983"
    }
  }

def append_str(result, new_word):
  return '%s\n%s' % (result, new_word)


##GUI window
class MainWindow(wx.Frame):
  def __init__(self, parent, title):
    wx.Frame.__init__(self, parent, title=title, size=(1000, 500))
    # self.control = wx.TextCtrl(self, style=wx.TE_MULTILINE)
    self.CreateStatusBar() # A Statusbar in the bottom of the window
    # Setting up the menu.
    
    self.Show(True)


##crawle
class Application(object):
  def __init__(self, param):
    self.result = {}
    self.map = param["map"]
    # self.createWidget()
    self.ajax(param["cookie"])
    self.query()
    # self.write_result(param["path_name"], param["key"])

  def createWidget(self):
    self.app = wx.App(False)  # Create a new app, don't redirect stdout/stderr to a window.
    self.frame = MainWindow(None, "CAT Analyse") # A Frame is a top-level window.
    self.app.MainLoop()

  def append_result(self, index, element):
    self.result.append(self.q(element).text())

  def query(self):
    self.q = pq(self.response.text)
    for key in self.map:
      single_result = self.result[key] = {}
      self.q('table tr:eq(%s) td:eq(1)' % (self.map[key])).each(
        lambda index, item: 
          el = self.q(item).text()
          if single_result.get(el) != None:
            single_result[el] = single_result[el] + 1
          else:
            single_result[el] = 1
      )
    print(1)

  def ajax(self, cookie):
    self.response = requests.get('http://cat.dp/cat/r/frontend?op=logDetail&logQuery.day=2018-01-26&logQuery.startTime=00:00&logQuery.endTime=23:30&logQuery.project=takeaway-wxwallet&logQuery.pageUrl=all&logQuery.level=error&logQuery.category=jsError&logQuery.platform=-1&logQuery.city=-1&logQuery.network=-1&logQuery.operator=-1&logQuery.container=-1&logQuery.limit=2&logQuery.offset=0&logQuery.secCategory=unhandledrejection', cookies=cookie)
    print(self.response)

  def write_result(self, path_name, file_name):
    table = Workbook()
    sheet = table.add_sheet(file_name, cell_overwrite_ok = True)
    for index,item in enumerate(self.result):
      sheet.write(index, 0, item)
    table.save('cat.xls')

# run
Application(config_sys_info())
