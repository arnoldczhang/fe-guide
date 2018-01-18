# ajax plugin
# For python 3.X
# format like this:
# POST https://example.com/comments
# content-type: application/json

# {
#     "name": "sample",
#     "time": "Wed, 21 Oct 2015 18:27:50 GMT"
# }
import sublime, sublime_plugin, http.client, json, re
from urllib import parse

class ajaxListener(sublime_plugin.EventListener):
    def on_post_save(self, view):
        file_name = view.file_name() or ''
        is_http_file = re.compile(r"\.http").search(file_name)
        if is_http_file:
            view.run_command('ajax')

class ajaxCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        view = self.view
        window = view.window()
        file_name = view.file_name() or ''
        selection = view.sel()[0]
        region = sublime.Region(selection.a, selection.b)
        select_words = view.substr(region)
        if select_words == '' and re.compile(r"\.http").search(file_name):
            select_words = view.substr(sublime.Region(0, view.size()))

        def file_match_func(file_name):
            return re.compile(r"(.+\\[^\.\\]+)\.[^\.]+$").match(file_name)

        def content_type_func(select_words):
            return re.compile(r"content\-type\:\s([^\s]+)").search(select_words)

        def ajax_func(select_words):
            return re.compile(r"((?:POST|post|GET|get|PUT|put|DELETE|delete)*)\s+((?:http://|https://|))([^\/]+)([^\s]+)").search(select_words)

        def data_func(select_words):
            return re.compile(r"(\{[^\{\}]+\})").search(select_words)

        def send_request(req_host, req_method, req_url, req_data, content_type):
            conn = http.client.HTTPConnection(req_host)
            headerdata = {
                'Content-Type' : content_type,
                'signal' : 'ab4494b2-f532-4f99-b57e-7ca121a137ca'
            }
            conn.request(method = req_method.upper(), url = req_url, body = req_data, headers = headerdata) 
            response = conn.getresponse()
            res= response.read()
            conn.close()

            if res != '':
                json_str = json.loads(res.decode())
                f = open(match_file_name + '.json', 'w')
                f.write(json.dumps(json_str, indent = 4))
                f.close()
                window.focus_group(window.num_groups() - 1)
                window.open_file(match_file_name + '.json')
            else:
                print('response cause error')

        #file name
        file_name_match = file_match_func(file_name)
        if file_name_match:
            match_file_name = file_name_match.group(1)
        else:
            match_file_name = 'test'
            print('not match the file format')

        #content-type
        content_type_match = content_type_func(select_words)
        if content_type_match:
            content_type = content_type_match.group(1)
        else:
            content_type = 'application/x-www-form-urlencoded;charset=UTF-8'

        #ajax url/method/host
        ajax_match = ajax_func(select_words)
        if ajax_match:
            req_method = ajax_match.group(1) or 'GET'
            req_host = ajax_match.group(3) or 'm.lvmama.com'
            req_url = ajax_match.group(2) + req_host + ajax_match.group(4)
        else:
            print('not match the format of ajax')
            return

        #data
        data_match = data_func(select_words)
        if data_match:
            req_data = parse.urlencode(json.loads(data_match.group(1)))
        else:
            req_data = parse.urlencode({})
            print('no data to be committed')

        return send_request(req_host, req_method, req_url, req_data, content_type)
