import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver, ElementUiResolver } from 'unplugin-vue-components/resolvers'

export default function createVueComponents() {
    return Components({
        resolvers: [
            ElementPlusResolver(),
            ElementUiResolver()
        ],
        dts: false
    })
}
