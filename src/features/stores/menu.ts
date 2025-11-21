import { create } from 'zustand'

type SettingsTabKey =
  | 'description'
  | 'based'
  | 'character'
  | 'ai'
  | 'voice'
  | 'speechInput'
  | 'youtube'
  | 'log'
  | 'other'
interface MenuState {
  showWebcam: boolean
  showCapture: boolean
  fileInput: HTMLInputElement | null
  bgFileInput: HTMLInputElement | null
  activeSettingsTab: SettingsTabKey
}

const menuStore = create<MenuState>((set, get) => ({
  showWebcam: false,
  showCapture: false,
  fileInput: null,
  bgFileInput: null,
  activeSettingsTab: 'description',
}))

export default menuStore
