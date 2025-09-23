## python

## 参考

- http://blog.csdn.net/freewebsys/article/details/46683645
- [python和javascript相互运行](https://github.com/Distributive-Network/PythonMonkey)
- [2025年怎么学python](https://www.cesarsotovalero.net/blog/i-am-switching-to-python-and-actually-liking-it.html)
- [开源的ai文件管理系统](https://github.com/DrizzleTime/Foxel)
- [支持多平台的基于ai的视频转录工具](https://github.com/wendy7756/AI-Video-Transcriber)
- ...



## 操作流程

- 启动

```sh
python3 ./src/python/super_cat.py
```
- 安装py2app
```python
pip3 install py2app
```
- 生成setup.py
```python
py2applet --make-setup hello.py
```
- 打包（自己开发，打包速度快）
```python
python setup.py py2app -A
```
- 给其他没有sdk的电脑使用，包括lib库。
```python
python setup.py py2app
```