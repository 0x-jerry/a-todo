import {
  defineConfig,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
  presetAttributify,
  presetIcons,
} from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
