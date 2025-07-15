# vite常用配置

## 配置项

### root

### base
类似webpack的output.publicPath

### plugins
- @vitejs/plugin-vue
- @vitejs/plugin-react
- vite-bundle-visualizer

### server
- port
- hot
- cors
- open
- host
- watch

解决windows wsl模式下监听问题
```js
watch: {
  usePolling: true,
},
```

### publicDir
静态资源目录，默认public，构建时被复制到build.outDir

### mode
production/development

### resolve
同webpack
```js
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components')
    }
  }
})
```

### build

- outDir
- assetsDir（静态资源存放目录）
- assetsInlineLimit（小于阈值的文件内联为base64）
- sourcemap
- minify（默认esbuild）
- rollupOptions

### define

```js
define: { __APP_VERSION__: JSON.stringify('1.0.0') }
```