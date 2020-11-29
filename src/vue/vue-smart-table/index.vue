<template>
    <el-container class="container">
        <el-form
            class="container__form"
            :model="form"
        >
            <el-table
                class="container__table"
                :data="form.dataList"
                v-loading="table.$props && table.$props.loading"
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
                    <template
                        v-slot="{ row, column, $index }"
                    >
                        <template
                            v-for="(col, index) in getParentColumn(colItem)"
                        >
                            <!-- 复杂类型展示（不支持深层嵌套） -->
                            <template v-if="col.type">
                                <!-- 为兼容一个单元格多元素，元素对象必须有key且key和单元格key相同时才有error提示 -->
                                <el-form-item
                                    v-if="!col.pure"
                                    :key="col.key + '_column_' + $index"
                                    :prop="'dataList.' + $index + '.' + col.key"
                                    :class="getTableCellKlass($index, col.key)"
                                    :error="getTableCellError(errorList[$index][col.key])"
                                >
                                    <component
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
                            <!-- 纯静态文案展示 -->
                            <label
                                v-else-if="typeof col === 'string'"
                                :key="col + $index"
                                :class="getTableCellKlass($index, key)"
                            >
                                {{ col }}
                            </label>
                            <!-- 纯动态字段展示（支持深层嵌套） -->
                            <label
                                v-else
                                :key="col.key + '_static_column_' + $index"
                                :class="getTableCellKlass($index, col.key)"
                            >
                                {{ safeGetValue(col.key, row) }}
                            </label>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <el-footer v-if="pagination">
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