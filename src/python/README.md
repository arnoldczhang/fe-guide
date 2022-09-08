## python

- 参考
  - http://blog.csdn.net/freewebsys/article/details/46683645
  - ...

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