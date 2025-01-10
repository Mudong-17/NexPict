import { useAppStore } from '@renderer/store'
import { Tooltip } from '@fluentui/react-components'
import {
  ChevronCircleDown20Regular,
  Emoji20Regular,
  Power20Regular,
  WeatherMoon20Regular,
  WeatherSunny20Regular
} from '@fluentui/react-icons'
import { Hamburger } from '@fluentui/react-nav-preview'
import { useShallow } from 'zustand/react/shallow'

export const Header = ({
  isOpen,
  setIsOpen
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) => {
  const [darkMode, setDarkMode] = useAppStore(
    useShallow((state) => [state.darkMode, state.setDarkMode])
  )

  return (
    <div className="h-14 flex items-center">
      <Tooltip content={isOpen ? '收起' : '打开'} relationship="label">
        <Hamburger onClick={() => setIsOpen(!isOpen)} />
      </Tooltip>
      <div className="flex-1 h-full app-drag flex items-center justify-center"></div>
      <div className="flex gap-2 px-4">
        <Tooltip content={darkMode ? '日间模式' : '黑暗模式'} relationship="label">
          {darkMode ? (
            <WeatherSunny20Regular
              className="cursor-pointer"
              onClick={() => setDarkMode(!darkMode)}
            />
          ) : (
            <WeatherMoon20Regular
              className="cursor-pointer"
              onClick={() => setDarkMode(!darkMode)}
            />
          )}
        </Tooltip>
        <Tooltip content="悬浮" relationship="label">
          <Emoji20Regular className="cursor-pointer" />
        </Tooltip>
        <Tooltip content="托盘" relationship="label">
          <ChevronCircleDown20Regular className="cursor-pointer" />
        </Tooltip>
        <Tooltip content="退出" relationship="label">
          <Power20Regular
            className="cursor-pointer"
            onClick={() => window.electron.invoke('AppServices:quit')}
          />
        </Tooltip>
      </div>
    </div>
  )
}
