import requests, sys, wx, xlrd, re, json, datetime
from pyquery import PyQuery as pq
from tkinter import *
from tkinter import ttk
from xlwt import *
import tkinter.filedialog as filedialog
import tkinter.messagebox as messagebox
import webbrowser

CACH_FILE_NAME = './storage.json'
HOST = '%s%s%s' % ('http://', 'cat.', 'dp/cat/r/frontend')
KEY_MAP = {
  '项目名': 2,
  '项目地址': 3,
  '项目真实地址': 5,
  '省份': 9,
  '运营商': 10,
  '操作系统': 11,
  '运行环境': 12,
  '网络环境': 13,
  'UA': 14,
  'IP地址': 16,
  '错误内容': 17,
}
TYPE = {
  'DETAIL': 'logDetail',
  'LIST': 'logView'
}
TEMP = {}

def config_sys_info():
  return {
    'limit': 1,
    'key': 'unhandledrejection',
    'map': KEY_MAP,
    'path_name': '.',
    'project': '',
  }

def get_now(format = '%Y-%m-%d'):
  now = datetime.datetime.now()
  return now.strftime(format)

def append_str(result, new_word):
  return '%s\n%s' % (result, new_word)

def is_detail(type):
  return type == TYPE['DETAIL']

def is_list(type):
  return type == TYPE['LIST']

## GUI window
class MainWindow(Frame):
  def __init__(self, query_handler, master = None):
    Frame.__init__(self, master)
    self.query_handler = query_handler
    self.pack()
    # self.run_test()
    self.get_cach()
    self.createWidgets()

  def run_test(self):
    print(get_now())

  def get_cach(self):
    try:
      f = open(CACH_FILE_NAME, 'r')
      if f:
        self.storage = json.load(f)
      else:
        self.storage = {}
      f.close();
    except FileNotFoundError as e:
      self.storage = {}

  def createWidgets(self):
    self.render_body()
    self.render_footer()

  def render_body(self):
    self.error_label = Label(self, text = '错误内容：')
    self.error_label.pack()
    self.error_input = ttk.Combobox(self)
    self.error_input.bind("<<ComboboxSelected>>", self.combo_select)  
    self.error_input.pack()

    self.project_label = Label(self, text = '项目名称：')
    self.project_label.pack()
    default_value = StringVar()
    default_value.set('%s%s%s' % ('take', 'away-', 'wxwallet'))
    self.project_input = Entry(self, textvariable = default_value)
    self.project_input.pack()

    self.sample_label = Label(self, text = '样本数：')
    self.sample_label.pack()
    default_value = StringVar()
    default_value.set('1')
    self.sample_input = Entry(self, textvariable = default_value)
    self.sample_input.pack()

    self.date_label = Label(self, text = '日期：')
    self.date_label.pack()
    default_value = StringVar()
    default_value.set(get_now())
    self.date_input = Entry(self, textvariable = default_value)
    self.date_input.pack()

    self.start_time_label = Label(self, text = '开始时间：')
    self.start_time_label.pack()
    default_value = StringVar()
    default_value.set('00:00')
    self.start_time_input = Entry(self, textvariable = default_value)
    self.start_time_input.pack()

    self.end_time_label = Label(self, text = '结束时间：')
    self.end_time_label.pack()
    default_value = StringVar()
    default_value.set('23:30')
    self.end_time_input = Entry(self, textvariable = default_value)
    self.end_time_input.pack()

    self.session_label = Label(self, text = 'JSESSIONID：')
    self.session_label.pack()
    default_value = StringVar()
    default_value.set(self.storage.get('JSESSIONID') or '')
    self.session_input = Entry(self, textvariable = default_value)
    self.session_input.pack()

    self.ssoid_label = Label(self, text = 'ssoid：')
    self.ssoid_label.pack()
    default_value = StringVar()
    default_value.set(self.storage.get('ssoid') or '')
    self.ssoid_input = Entry(self, textvariable = default_value)
    self.ssoid_input.pack()

    self.file_label = Label(self, text = '保存路径：')
    self.file_label.pack()
    self.file_input = Entry(self)
    self.file_input.pack()
    self.query_button = Button(self, text = '选择文件夹...', command = self.select_file_dir)
    self.query_button.pack()

  def combo_select(self, *args):
    self.sample_input.delete(0, 'end')
    self.sample_input.insert(0, TEMP[self.error_input.get()])

  def select_file_dir(self):
    file_dir = filedialog.askdirectory()
    if file_dir:
      self.file_input.delete(0, 'end')
      self.file_input.insert(0, file_dir)

  def render_footer(self):
    self.query_list_button = Button(self, text='获取列表', command=self.query_list)
    self.query_list_button.pack(side = 'left')
    self.query_button = Button(self, text='查询结果', command=self.start_query)
    self.query_button.pack(side = 'left')
    self.quit_button = Button(self, text='退出', command=self.quit)
    self.quit_button.pack(side = 'right')

  def query_list(self):
    self.start_query(TYPE['LIST'])

  def start_query(self, type = TYPE['DETAIL']):
    content = self.error_input.get() or ''
    limit = self.sample_input.get() or '10'
    file_dir = self.file_input.get() or ''
    project = self.project_input.get() or ''
    session = self.session_input.get() or ''
    ssoid = self.ssoid_input.get() or ''
    date = self.date_input.get() or get_now()
    start_time = self.start_time_input.get() or '00:00'
    end_time = self.end_time_input.get() or '23:30'
    
    if is_list(type):
      content = 'all'

    self.query_handler({
      "content": content,
      "limit": limit,
      "file_dir": file_dir,
      "project": project,
      "JSESSIONID": session,
      "ssoid": ssoid,
      "date": date,
      "start_time": start_time,
      "end_time": end_time
    }, {
      'error_input': self.error_input
    }, type)

## crawler
class Application(object):
  def __init__(self, param):
    self.result = {}
    self.param = param
    self.map = param['map']
    self.createWidget()

  def query_handler(self, param, widget, log_type = TYPE['DETAIL']):
    self.query_content = param["content"] or self.param['key']
    self.limit = param["limit"] or self.param['limit']
    self.file_dir = param["file_dir"] or self.param['path_name']
    self.project = param["project"] or self.param['project']
    self.date = param['date']
    self.start_time = param['start_time']
    self.end_time = param['end_time']
    self.widget = widget
    self.log_type = log_type
    self.cookie = {
      "JSESSIONID": param['JSESSIONID'] or '',
      "ssoid": param['ssoid'] or ''
    }
    self.ajax()
    if is_detail(log_type):
      self.simple_query()
      self.write_result()

  def createWidget(self):
    self.app = MainWindow(self.query_handler)
    self.app.master.geometry('500x550+500+200')
    self.app.master.title('监控')
    self.app.mainloop()

  def append_result(self, uniq_key):
    def append(index, item):
      element = self.q(item).text()
      result = self.result
      if result[uniq_key].get(element) != None:
        result[uniq_key][element] = result[uniq_key][element] + 1
      else:
        result[uniq_key][element] = 1
    return append

  def append_list(self, array):
    point_re = re.compile(r",")
    def append(index, item):
      children = self.q(item).children()
      error_key = self.q(children.eq(0)).text()
      error_times = self.q(children.eq(1)).text()
      array.append(error_key)
      TEMP[error_key] = point_re.sub('', error_times)
    return append

  def simple_list_query(self):
    self.q = pq(self.response_text)
    input_values = []
    self.q('table.table-striped tr').each(self.append_list(input_values))
    self.widget['error_input']["values"] = input_values
    messagebox.showinfo('提示', '获取错误信息列表成功')

  def simple_query(self):
    self.q = pq(self.response_text)
    for key in self.map:
      self.result[key] = {}
      self.q('table tr:eq(%s) td:eq(1)' % (self.map[key])).each(self.append_result(key))

  def ajax(self):
    url = '%s?op=%s&logQuery.day=%s&logQuery.startTime=%s&logQuery.endTime=%s&logQuery.project=%s&logQuery.pageUrl=all&logQuery.level=error&logQuery.category=jsError&logQuery.platform=-1&logQuery.city=-1&logQuery.network=-1&logQuery.operator=-1&logQuery.container=-1&logQuery.limit=%s&logQuery.offset=0&logQuery.secCategory=%s' % (HOST, self.log_type, self.date, self.start_time, self.end_time, self.project, self.limit, self.query_content)
    self.response = requests.get(url, cookies = self.cookie)
    self.response_text = self.response.text
    login_match = re.compile(r'注销').search(self.response_text)
    if login_match:
      print('请求成功...')
      f = open(CACH_FILE_NAME, 'w')
      f.write(json.dumps(self.cookie, indent = 4, ensure_ascii=False))
      f.close()
      if is_list(self.log_type):
        self.simple_list_query()
    else:
      print('请登录...')
      webbrowser.open_new_tab(url)
      self.browser = webbrowser.get()
      messagebox.showinfo('提示', '当前未登录，请登录完之后，回填JSESSIONID 和 ssoid')

  def write_result(self):
    table = Workbook()
    for result_key in self.result:
      result = self.result[result_key]
      sheet = table.add_sheet(result_key, cell_overwrite_ok = True)
      sheet.write(0, 0, '内容')
      sheet.write(0, 1, '出现次数')
      for index,key in enumerate(result):
        sheet.write(index + 1, 0, key)
        sheet.write(index + 1, 1, result[key])
    table.save('%s/%s.xls' % (self.file_dir, self.query_content))
    messagebox.showinfo('提示', '保存成功')

## run
Application(config_sys_info())
