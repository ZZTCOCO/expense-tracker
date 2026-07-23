import { ref, watch } from 'vue'

export const THEME_STORAGE_KEY = 'expense-tracker-theme'
type Theme = 'dark' | 'light'

/** 读取初始主题：已保存的优先，否则跟随系统，再否则默认暗色（炫酷） */
function readInitial(): Theme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') return saved
    const preferLight =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches
    return preferLight ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

// 全局共享的暗色状态（单例）
const isDark = ref<boolean>(readInitial() === 'dark')

function apply(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
}

// 模块加载时立即应用，避免首屏闪烁（index.html 也会预置一次）
apply(isDark.value)

export function useTheme() {
  function toggle() {
    isDark.value = !isDark.value
  }

  // 持久化 + 同步 class（首个调用方注册 watch 即可）
  watch(
    isDark,
    (dark) => {
      apply(dark)
      try {
        localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light')
      } catch {
        /* 忽略存储异常 */
      }
    },
    { flush: 'sync' },
  )

  return { isDark, toggle }
}
