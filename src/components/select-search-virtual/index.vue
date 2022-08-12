<template>
  <el-popover
    :visible="visible"
    placement="bottom-start"
    :width="triggerRef ? triggerRef.offsetWidth : 200"
    :offset="4"
    :show-arrow="false"
    @before-enter="afterHide"
  >
    <template #reference>
      <div
        ref="triggerRef"
        class="
          select-v
          h-[34px]
          bg-[#F4F4F8]
          border-input
          rounded
          ring-shadowColor-1 ring-1
          flex
          gap-1
          items-center
          content-center
          p-1
          pr-7
          relative
          hover:ring-main-3
          ring-inset
        "
        :class="{
          'ring-main-1 ring-inset hover:ring-main-1 hover:ring-inset': visible
        }"
        @click="visible = true"
        v-click-outside="clickOutSide"
      >
        <template v-if="bindValue.length > 0">
          <div
            class="h-[26px] rounded bg-white px-2 py-1 flex items-center gap-1"
            v-show="firstLabel"
          >
            <span class="truncate1">
              {{ firstLabel }}
            </span>
            <span
              class="
                iconfont
                icon-cha
                text-sm text-font-4
                hover:cursor-pointer
                hover:text-font-3
                duration-300
              "
              @click="handleClose(0)"
            ></span>
          </div>
          <div
            class="h-[26px] rounded bg-white px-2 py-1 flex items-center gap-1"
            v-show="secondLabel"
          >
            <span class="truncate1">
              {{ secondLabel }}
            </span>
            <span
              class="
                iconfont
                icon-cha
                text-sm text-font-4
                hover:cursor-pointer
                hover:text-font-3
                duration-300
              "
              @click="handleClose(1)"
            ></span>
          </div>
          <div
            class="h-[26px] rounded bg-white px-2 flex items-center py-1"
            v-show="bindValue.length > 2"
          >
            +{{ bindValue.length - 1 }}
          </div>
        </template>
        <span class="text-main-4 ml-2" v-else>请选择</span>
        <span
          @mouseover="handleMouseover"
          @mouseleave="clearIconShow = false"
          class="duration-300 absolute right-2 text-sm text-icon-1"
          :class="{
            'rotate-180': visible,
            'cursor-pointer': clearIconShow
          }"
          @click.stop="handleClear"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            id="chevron-down"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              class="duration-300"
              :d="
                clearIconShow
                  ? 'M6 6 L18 18 M6 18 L18 6'
                  : 'M6 8 L12 15 M18 8 L12 15'
              "
            ></path>
          </svg>
        </span>
      </div>
    </template>
    <div
      class="h-[250px] overflow-hidden relative pt-8 bg-white"
      :class="{
        ' h-16': !filterData.length
      }"
    >
      <el-input
        v-model="inputs"
        class="absolute w-full top-[-5px] ring-1 ring-shadowColor-1"
        :placeholder="placeholder"
      >
        <template #prefix>
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            id="search"
            class="w-4 h-4 text-font-3 mr-1"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </template>
      </el-input>
      <virtual-list
        v-if="filterData.length"
        :data="filterData"
        ref="vRef"
        :item-size="$slots.default ? 60 : 40"
      >
        <template #default="{ item }">
          <div
            @click="handleChoose(item)"
            class="
              relative
              text-font-1
              cursor-pointer
              h-full
              font-medium
              px-2
              py-1
              hover:bg-[#F9F9FD]
            "
            :class="{
              'item-active': ~bindValue
                .map(d => (valueKey ? d : d[uniqueKey]))
                .indexOf(item[uniqueKey])
            }"
          >
            <slot :item="item" :inputs="inputs">
              <span
              class="flex items-center"
                v-html="
                  brightenKeyword(item[labelKey], inputs, ' rgb(115 105 204)')
                "
              ></span>
            </slot>
          </div>
        </template>
      </virtual-list>
      <div v-else class="text-font-4 h-full flex items-center">
        暂无匹配的结果
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { watch, computed, ref, nextTick } from "vue"
import { brightenKeyword } from "../../libs/util.js"
import VirtualList from "../virtual-list/index.vue"
import { ElInput, ElPopover, ClickOutside } from "element-plus"
interface Props {
  modelValue: any
  /** 作为列表唯一标识的键名，绑定值为对象类型时必填 */
  uniqueKey: string
  /** 作为绑定value的键名 若不传则绑定整个item */
  valueKey?: string
  /** 作为显示名称的键名*/
  labelKey?: string
  clearable: boolean
  placeholder: string
  options: Array<any>
  searchLabels?: Array<string>
  multiable?: boolean
}

const vClickOutside = ClickOutside
const props = withDefaults(defineProps<Props>(), {
  uniqueKey: "id",
  labelKey: "label",
  clearable: true,
  placeholder: "请输入",
  multiable: true
})
const emit = defineEmits(["update:modelValue"])
console.log(emit)

const inputs = ref("")
const opt = ref([])
watch(
  () => props.options,
  e => {
    opt.value = JSON.parse(JSON.stringify(e))
  },
  { immediate: true }
)
const triggerRef = ref<HTMLBaseElement>()
const vRef = ref<InstanceType<typeof VirtualList>>()
const visible = ref(false)
const clearIconShow = ref(false)
const bindValue = computed({
  get: () => props.modelValue ?? (props.multiable ? [] : ""),
  set: e => emit("update:modelValue", e)
})

const labelByIndex = index => {
  if (props.valueKey) {
    return (bindValue.value?.[index] || bindValue.value?.[index] === 0)
      ? opt.value.find(
          (d: object) => d[props.valueKey as string] === bindValue.value[index]
        )?.[props.labelKey]
      : ""
  }
  return bindValue.value?.[index] ? bindValue.value[index][props.labelKey] : ""
}
const firstLabel = computed(() => labelByIndex(0))
const secondLabel = computed(() => labelByIndex(1))

const filterData = computed(() => {
  if (props.searchLabels && props.searchLabels.length) {
    return opt.value.filter((d: object) =>
      props!.searchLabels!.some(
        key => ~d[key].toLowerCase().indexOf(inputs.value.toLowerCase())
      )
    )
  }
  return opt.value.filter(
    (d: object) =>
      ~String(d[props.labelKey].toLowerCase()).indexOf(
        inputs.value.toLowerCase()
      )
  )
})

const handleChoose = item => {
  console.log(bindValue.value)

  const index = bindValue.value
    .map(d => (props.valueKey ? d : d[props.uniqueKey]))
    .indexOf(item[props.uniqueKey])
  if (~index) {
    bindValue.value.splice(index, 1)
  } else {
    bindValue.value.push(props.valueKey ? item[props.valueKey] : item)
  }
}

const clickOutSide = e => {
  const classNames = e.path.map(item => item.className)
  if (!~classNames.indexOf("el-popper is-light el-popover")) {
    visible.value = false
  }
}

const handleMouseover = () => {
  if (props.clearable === false) {
    return
  }
  const isHasValue = Array.isArray(bindValue.value)
    ? bindValue.value?.[0]
    : bindValue.value
  clearIconShow.value = isHasValue === 0 ? true : !!isHasValue
}

const handleClose = index => {
  bindValue.value.splice(index, 1)
}

const handleClear = () => {
  bindValue.value = Array.isArray(bindValue.value) ? [] : ""
  visible.value = false
}

const treeSortByDisabled = tree => {
  tree.sort((a, b) => {
    if (a.disabled) {
      return 1
    }
    return b.disabled ? -1 : 1
  })
  tree.forEach(item => {
    if (item.children && item.children.length) {
      treeSortByDisabled(item.children)
    }
  })
}
const afterHide = () => {
  inputs.value = ""
  const arr = bindValue.value
    .map(d => (props.valueKey ? d : d[props.uniqueKey]))
    .reverse()
  opt.value.sort((a, b) => {
    if (props.valueKey) {
      return (
        bindValue.value.indexOf(b[props.valueKey]) -
        bindValue.value.indexOf(a[props.valueKey])
      )
    } else {
      return arr.indexOf(b[props.uniqueKey]) - arr.indexOf(a[props.uniqueKey])
    }
  })
  console.log(opt.value)

  nextTick(() => {
    vRef.value?.resetScroll()
  })
}
</script>

<style lang="scss" scoped>
:deep(.el-input__wrapper) {
  @apply flex items-center px-3 h-10 shadow-none;
}
:deep(.list-container::-webkit-scrollbar) {
  width: 6px;
}
.item-active {
  @apply text-main-1;
}
.truncate1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>
