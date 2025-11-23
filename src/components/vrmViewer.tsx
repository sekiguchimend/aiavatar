import { useCallback } from 'react'

import homeStore from '@/features/stores/home'
import settingsStore from '@/features/stores/settings'

export default function VrmViewer() {
  const canvasRef = useCallback((canvas: HTMLCanvasElement) => {
    if (canvas) {
      const { viewer } = homeStore.getState()
      let { selectedVrmPath } = settingsStore.getState()

      // デフォルトのVRMパスを設定（空または無効な場合）
      if (
        !selectedVrmPath ||
        selectedVrmPath === '' ||
        !selectedVrmPath.endsWith('.vrm')
      ) {
        selectedVrmPath = '/vrm/AvatarSample_A.vrm'
        settingsStore.setState({ selectedVrmPath })
      }

      viewer.setup(canvas)

      // VRMファイルの読み込み（エラーハンドリング付き）
      const loadVrmWithFallback = async (vrmPath: string) => {
        try {
          // loadVrmは内部的にPromiseを使用しているため、エラーはcatchされない
          // 代わりに、viewer.loadVrmを呼び出し、エラーが発生した場合はデフォルトを試す
          viewer.loadVrm(vrmPath)
        } catch (error) {
          console.error('Failed to load VRM:', error)
          // デフォルトのVRMを試す
          const defaultVrm = '/vrm/AvatarSample_A.vrm'
          if (vrmPath !== defaultVrm) {
            settingsStore.setState({ selectedVrmPath: defaultVrm })
            try {
              viewer.loadVrm(defaultVrm)
            } catch (fallbackError) {
              console.error('Failed to load default VRM:', fallbackError)
            }
          }
        }
      }

      loadVrmWithFallback(selectedVrmPath)

      // Drag and DropでVRMを差し替え
      canvas.addEventListener('dragover', function (event) {
        event.preventDefault()
      })

      canvas.addEventListener('drop', function (event) {
        event.preventDefault()

        const files = event.dataTransfer?.files
        if (!files) {
          return
        }

        const file = files[0]
        if (!file) {
          return
        }
        const file_type = file.name.split('.').pop()
        if (file_type === 'vrm') {
          const blob = new Blob([file], { type: 'application/octet-stream' })
          const url = window.URL.createObjectURL(blob)
          viewer.loadVrm(url)
        } else if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = function () {
            const image = reader.result as string
            image !== '' && homeStore.setState({ modalImage: image })
          }
        }
      })
    }
  }, [])

  return (
    <div className={'absolute top-0 left-0 w-screen h-[100svh] z-5'}>
      <canvas ref={canvasRef} className={'h-full w-full'}></canvas>
    </div>
  )
}
