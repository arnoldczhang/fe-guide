import requests, sys, wx, xlrd, re, json, datetime, os, xlsxwriter, threading
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
  '项目': 2,
  '页面URL': 3,
  '实际URL': 5,
  '省份': 9,
  '运营商': 10,
  '操作系统': 11,
  '容器类型': 12,
  '网络类型': 13,
  'User Agent': 14,
  '用户IP': 16,
  '日志内容': 17,
}
TYPE = {
  'DETAIL': 'logDetail',
  'LIST': 'logView'
}
TEMP = {}

PROJ_INDEX = 356
START_TIME = '00:00'
END_TIME = '23:30'

def config_sys_info():
  return {
    'limit': 1,
    'key': 'unhandledrejection',
    'map': KEY_MAP,
    'path_name': '.',
    'project': '%s%s%s%s' % ('take', 'away', '-wx', 'wallet'),
  }

def get_now(format = '%Y-%m-%d', need_print = False):
  now = datetime.datetime.now()
  result = now.strftime(format)
  if need_print:
    print(result)
  return result

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
    print('start test')

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
    self.error_input['values'] = self.storage.get('error_list') or ()
    self.error_input.bind('<<ComboboxSelected>>', self.combo_select)
    if len(self.error_input['values']) > 1:
      self.error_input.current(1)
    self.error_input.pack()

    self.project_label = Label(self, text = '项目名称：')
    self.project_label.pack()
    self.project_input = ttk.Combobox(self)
    self.project_input['values'] = self.storage.get('project_list') or ()
    if len(self.project_input['values']) > PROJ_INDEX:
      self.project_input.current(PROJ_INDEX)
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
    default_value.set(self.storage.get('start_time') or START_TIME)
    self.start_time_input = Entry(self, textvariable = default_value)
    self.start_time_input.pack()

    self.end_time_label = Label(self, text = '结束时间：')
    self.end_time_label.pack()
    default_value = StringVar()
    default_value.set(self.storage.get('end_time') or END_TIME)
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
    self.sample_input.insert(0, TEMP.get(self.error_input.get()) or '1')

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
    start_time = self.start_time_input.get() or START_TIME
    end_time = self.end_time_input.get() or END_TIME
    
    if is_list(type):
      content = 'all'

    self.query_handler({
      'content': content,
      'limit': limit,
      'file_dir': file_dir,
      'project': project,
      'JSESSIONID': session,
      'ssoid': ssoid,
      'date': date,
      'start_time': start_time,
      'end_time': end_time
    }, {
      'error_input': self.error_input,
      'project_input': self.project_input,
      'sample_input': self.sample_input,
      'project_input': self.project_input
    }, type)

## Application
class Application(object):
  def __init__(self, param):
    self.result = {}
    self.cookie = {}
    self.param = param
    self.map = param['map']
    self.create_widget()

  def query_handler(self, param, widget, log_type = TYPE['DETAIL']):
    self.widget = widget
    self.log_type = log_type
    self.extend_param(param)
    self.update_storage(param)
    self.ajax()
    if is_detail(log_type):
      self.simple_query()
      self.write_result()

  def extend_param(self, param = {}):
    self.query_content = param['content'] or self.param['key']
    self.limit = param['limit'] or self.param['limit']
    self.file_dir = param['file_dir'] or self.param['path_name']
    self.project = param['project'] or self.param['project']
    self.date = param['date']
    self.start_time = param['start_time'] or START_TIME
    self.end_time = param['end_time'] or END_TIME

  def update_storage(self, param = {}):
    try:
      self.storage
    except:
      self.storage = {}
    self.cookie['JSESSIONID'] = self.storage['JSESSIONID'] = param['JSESSIONID'] or ''
    self.cookie['ssoid'] = self.storage['ssoid'] = param['ssoid'] or ''
    self.storage['start_time'] = param['start_time'] or START_TIME
    self.storage['end_time'] = param['end_time'] or END_TIME

  def create_widget(self):
    self.app = MainWindow(self.query_handler)
    self.app.master.geometry('500x550+500+200')
    self.app.master.title('监控')
    self.app.mainloop()

  def append_result(self, uniq_key):
    uniq_result = self.result[uniq_key]
    def append(text):
      if text:
        if uniq_result.get(text) != None:
          uniq_result[text] += 1
        else:
          uniq_result[text] = 1
    return append

  def append_error_list(self, array):
    point_re = re.compile(r',')
    def append(index, item):
      children = self.q(item).children()
      error_key = self.q(children.eq(0)).text()
      error_times = self.q(children.eq(1)).text()
      array.append(error_key)
      TEMP[error_key] = point_re.sub('', error_times)
    return append

  def append_project_list(self, array):
    def append(index, item):
      array.append(self.q(item).text())
    return append

  def simple_list_query(self):
    self.q = pq(self.response_text)
    input_values = []
    project_values = []
    self.q('table.table-striped tr').each(self.append_error_list(input_values))
    self.storage['error_list'] = input_values
    self.widget['error_input']['values'] = input_values
    if len(input_values) > 1:
      self.widget['error_input'].current(1)
      self.widget['sample_input'].delete(0, 'end')
      self.widget['sample_input'].insert(0, TEMP.get(input_values[1]) or '1')      
    # dont cach project list if is existed
    if ('project_list' in self.storage) == False:
      self.storage['project_list'] = project_values
      self.q('select#project option').each(self.append_project_list(project_values))
      self.widget['project_input']['values'] = project_values
    # dont reset project value if is existed
    if self.widget['project_input'].get():
      print('project has default value')
    else:
      if len(project_values) > PROJ_INDEX:
        self.widget['project_input'].current(PROJ_INDEX)
    messagebox.showinfo('提示', '获取错误信息列表成功')

  def run_query_thread(self, place, callback, index):
    print('thread_%s is start' % (index))
    query_re = re.compile(r'<tr>\s*<td>%s</td>\s*<td\s*(?:class\=[\w\'\"]+|)\s*>\s*(?:<pre\s+style\=[^<>]+\s*>|)\s*([^<>]+)\s*(?:</pre>\s*|)</td>\s*</tr>' % (place))
    query_text_arr = query_re.findall(self.response_text) or []
    for query_text in query_text_arr:
      callback(query_text)
    print('thread_%s is done' % (index))

  def simple_query(self):
    self.q = pq(self.response_text)
    queue = []
    for index,key in enumerate(self.map):
      self.result[key] = {}
      append_result = self.append_result(key)
      thread = threading.Thread(target=self.run_query_thread, args=(key, append_result, index,))
      thread.start()
      queue.append(thread)
    for thread in queue:
      thread.join()

  def cach_storage(self):
    f = open(CACH_FILE_NAME, 'w')
    f.write(json.dumps(self.storage, indent = 4, ensure_ascii=True))
    f.close()

  def ajax(self):
    url = '%s?op=%s&logQuery.day=%s&logQuery.startTime=%s&logQuery.endTime=%s&logQuery.project=%s&logQuery.pageUrl=all&logQuery.level=error&logQuery.category=jsError&logQuery.platform=-1&logQuery.city=-1&logQuery.network=-1&logQuery.operator=-1&logQuery.container=-1&logQuery.limit=%s&logQuery.offset=0&logQuery.secCategory=%s' % (HOST, self.log_type, self.date, self.start_time, self.end_time, self.project, self.limit, self.query_content)
    self.response = requests.get(url, cookies = self.cookie)
    self.response_text = self.response.text
    login_match = re.compile(r'注销').search(self.response_text)
    if login_match:
      print('请求成功...')
      if is_list(self.log_type):
        self.simple_list_query()
      self.cach_storage()
    else:
      webbrowser.open_new_tab(url)
      self.browser = webbrowser.get()
      messagebox.showinfo('提示', '当前未登录，请登录完之后，回填JSESSIONID 和 ssoid')

  def write_result(self):
    restrict_re = re.compile(r'[,\/\s\|:\'\"]')
    query_content = restrict_re.sub('', self.query_content)
    file_path = '%s/%s.xlsx' % (self.file_dir, query_content)
    workbook = xlsxwriter.Workbook(file_path)
    for result_key in self.result:
      result = self.result[result_key]
      worksheet = workbook.add_worksheet(result_key)
      worksheet.write(0, 0, '内容')
      worksheet.write(0, 1, '出现次数')
      worksheet.write(0, 2, '占比')
      result = sorted(result.items(), key=lambda d: -d[1])
      for index, item in enumerate(result):
        worksheet.write(index + 1, 0, item[0])
        worksheet.write(index + 1, 1, item[1])
        worksheet.write(index + 1, 2, '%s%%' % (round(int(item[1]) / int(self.limit) * 100)))
    workbook.close()
    messagebox.showinfo('提示', '保存成功')
    os.system('open %s' % (file_path))

## run
Application(config_sys_info())
