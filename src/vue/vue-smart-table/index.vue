<template>
  <el-container class="container">
    <el-form
      ref="smartForm"
      class="container__form"
      :model="form"
    >
      <el-table
        ref="smartTable"
        class="container__table"
        :data="form.dataList"
        v-loading="table.$props && table.$props.loading"
        :span-method="table.$props && table.$props['span-method']"
        v-bind="table.$props"
        v-on="bindContextListeners(table.$listeners)"
      >
        <el-table-column
          v-for="(colItem, cIndex) in columnInfo"
          :key="cIndex + '_header'"
          :prop="getTableProperty(colItem)"
          v-bind="getTableProps(colItem)"
          v-on="getTableListeners(colItem)"
        >
          <!--
              自定义表头的内容. 参数为 { column, $index }
              https://element.eleme.cn/#/zh-CN/component/table#table-column-scoped-slot
          -->
          <template
            v-if="hasColumnHeader(colItem)"
            slot="header"
          >
            <slot
              name="header"
              v-bind="getTableProps(colItem)"
            ></slot>
          </template>
          <!-- 表格里的type="selection"不应该有template -->
          <template
            v-if="getTableProps(colItem).type !== 'selection'"
            v-slot="{ row, column, $index }"
          >
            <template
              v-for="(col, index) in getParentColumn(colItem)"
            >
              <!-- 复杂类型展示（不支持深层嵌套）or 有slot -->
              <template v-if="col.type || hasSlot(col.key)">
                <!-- 为兼容一个单元格多元素，元素对象必须有key且key和单元格key相同时才有error提示 -->
                <el-form-item
                  v-if="!col.pure"
                  :key="col.key + '_column_' + $index"
                  :prop="'dataList.' + $index + '.' + col.key"
                  :error="getTableCellError(errorList[$index][col.key])"
                >
                  <!-- type=SCOPE_TYPE，且设置rules的slot，是需要表单校验的scope-slot，在这里插入 -->
                  <template v-if="col.rules && hasSlot(col.key)">
                    <slot
                      :name="col.key"
                      v-bind="getScopedColumnProps(col, { row, column, $index })"
                    ></slot>
                  </template>
                  <component
                    v-else
                    v-model="row[col.key]"
                    :is="getColumnType(col, { row, column, $index }, index)"
                    v-bind="getColumnProps(col.$props, { row, column, $index })"
                    v-on="getColumnListeners(col.$listeners, { row, column, $index }, index)"
                  >
                    <template v-if="col.children">
                      <!-- 复杂类型子元素展示 -->
                      <template v-for="child in getChildColumn(col.children, { row, column, $index })">
                        <component
                          v-if="child.type"
                          :is="child.type"
                          :key="child.key + '_child'"
                          v-bind="getColumnProps(child.$props, { row, column, $index })"
                          v-on="bindContextListeners(child.$listeners)"
                        ></component>
                        <!-- 简单类型子元素展示 -->
                        <template v-else>
                          {{child}}
                        </template>
                      </template>
                    </template>
                  </component>
                </el-form-item>
                <!-- type=SCOPE_TYPE，未设置rules的slot，则是普通scope-slot，在这里插入 -->
                <template v-else-if="hasSlot(col.key) && !col.rules">
                  <slot
                    :name="col.key"
                    v-bind="getScopedColumnProps(col, { row, column, $index })"
                  ></slot>
                </template>
                <!-- type=SCOPE_TYPE，但是又没插入scope-slot，按普通文案显示 -->
                <template v-else-if="isScopeType(col)">
                  {{
                    row[col.key]
                  }}
                </template>
                <!-- 纯自定义组件，不会包el-form-item -->
                <component
                  v-else
                  v-model="row[col.key]"
                  :key="col.key + '_column_' + $index"
                  :is="getColumnType(col, { row, column, $index }, index)"
                  v-bind="getColumnProps(col.$props, { row, column, $index })"
                  v-on="getColumnListeners(col.$listeners, { row, column, $index }, index)"
                >
                  <template v-if="col.children">
                    <!-- 复杂类型子元素展示 -->
                    <template v-for="child in getChildColumn(col.children, { row, column, $index })">
                      <component
                        v-if="child.type"
                        :is="child.type"
                        :key="child.key + '_child'"
                        v-bind="getColumnProps(child.$props, { row, column, $index })"
                        v-on="bindContextListeners(child.$listeners)"
                      ></component>
                      <!-- 简单类型子元素展示 -->
                      <template v-else>
                        {{child}}
                      </template>
                    </template>
                  </template>
                </component>
              </template>
              <!-- 纯动态字段展示（支持深层嵌套） -->
              <template v-else-if="col.key">{{ row[col.key] }}</template>
              <!-- 纯静态文案展示 -->
              <template v-else>{{ col }}</template>
            </template>
          </template>
        </el-table-column>
        <!-- 默认插的内容 -->
        <slot></slot>
        <!-- el-table在空数据时显示的文本内容 -->
        <template
          v-if="$slots.empty"
          slot="empty"
        >
          <slot name="empty"></slot>
        </template>
      </el-table>
    </el-form>
    <el-footer v-if="pagination">
      <slot name="table-footer"></slot>
      <el-pagination
        v-bind="pagination.$props"
        v-on="bindContextListeners(pagination.$listeners)"
      ></el-pagination>
    </el-footer>
  </el-container>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="less" scoped>
@import './index.less';
</style>