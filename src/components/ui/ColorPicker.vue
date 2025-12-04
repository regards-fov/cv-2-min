<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const emit = defineEmits(['changeColor'])

const props = defineProps({
    initialColor: { type: String, default: '#62b1c9' }
})

const H = ref(0)
const S = ref(0)
const V = ref(0)
const hex = ref(props.initialColor)

const svEl = ref(null)
const hueEl = ref(null)

const sample = {
    vives: ['#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#62b1c9', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'],
    pastels: ['#E3CBE2', '#E7BDBD', '#F6CFAF', '#F3E8B6', '#D2E5C3', '#B8D5E6', '#F5F5F5', '#9CA3AF']
}

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)) }

function hsvToRgb(h, s, v) {
    const c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c
    let r = 0, g = 0, b = 0
    if (h < 60) { r = c; g = x }
    else if (h < 120) { r = x; g = c }
    else if (h < 180) { g = c; b = x }
    else if (h < 240) { g = x; b = c }
    else if (h < 300) { r = x; b = c }
    else { r = c; b = x }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)]
}

function rgbToHex([r, g, b]) { return '#' + [r, g, b].map(n => n.toString(16).padStart(2, '0')).join('') }

function hexToRgb(hexv) {
    if (!hexv) return null
    let h = hexv.replace('#', '')
    if (h.length === 3) h = h.split('').map(x => x + x).join('')
    if (h.length !== 6) return null
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

const thumbStyle = computed(() => ({ left: `${clamp(S.value, 0, 1) * 100}%`, top: `${(1 - clamp(V.value, 0, 1)) * 100}%` }))
const hthumbStyle = computed(() => ({ top: `${(H.value / 360) * 100}%`, transform: 'translateY(-50%)' }))

function renderFromHSV() {
    const rgb = hsvToRgb(H.value, S.value, V.value)
    hex.value = rgbToHex(rgb)
    emit('changeColor', hex.value)
}

function setFromHex(v) {
    const rgb = hexToRgb(v)
    if (!rgb) return
    const r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
    let h = 0
    if (d === 0) h = 0
    else if (max === r) h = ((g - b) / d) % 6 * 60
    else if (max === g) h = ((b - r) / d + 2) * 60
    else h = ((r - g) / d + 4) * 60
    if (h < 0) h += 360
    H.value = Math.round(h)
    S.value = max ? d / max : 0
    V.value = max
    renderFromHSV()
}

function onHexChange() { setFromHex(hex.value.trim()) }

function svPointer(e) {
    const rect = svEl.value.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const x = clamp(clientX - rect.left, 0, rect.width)
    const y = clamp(clientY - rect.top, 0, rect.height)
    S.value = x / rect.width
    V.value = 1 - y / rect.height
    renderFromHSV()
}

function startSvPointer(ev) { ev.currentTarget.setPointerCapture(ev.pointerId); svPointer(ev) }
function moveSvPointer(ev) { if (ev.currentTarget.hasPointerCapture(ev.pointerId)) svPointer(ev) }

function huePointer(e) {
    const rect = hueEl.value.getBoundingClientRect()
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const y = clamp(clientY - rect.top, 0, rect.height)
    H.value = Math.round((y / rect.height) * 360)
    renderFromHSV()
}

function startHuePointer(ev) { ev.currentTarget.setPointerCapture(ev.pointerId); huePointer(ev) }
function moveHuePointer(ev) { if (ev.currentTarget.hasPointerCapture(ev.pointerId)) huePointer(ev) }

onMounted(() => {
    setFromHex(props.initialColor)
})

watch(() => props.initialColor, (newColor) => {
    if (newColor && newColor !== hex.value) {
        setFromHex(newColor)
    }
})

</script>

<template>
    <div class="card">
        <div class="wrapper">
            <div class="palette-select">
                <div
                    ref="svEl"
                    class="sv"
                    :style="{
                        background: `linear-gradient(transparent, #000), linear-gradient(90deg, #fff, hsl(${H}, 100%, 50%))`
                    }"
                    @pointerdown="startSvPointer"
                    @pointermove="moveSvPointer"
                    tabindex="0"
                    aria-label="Saturation et valeur"
                >
                    <div
                        class="thumb"
                        :style="{
                            ...thumbStyle,
                            transform: 'translate(-7px, -7px)'
                        }"
                    ></div>
                </div>

                <div
                    ref="hueEl"
                    class="hue"
                    :style="{
                        background: 'linear-gradient(180deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                    }"
                    @pointerdown="startHuePointer"
                    @pointermove="moveHuePointer"
                    tabindex="0"
                    aria-label="Teinte"
                >
                    <div
                        class="hthumb"
                        :style="hthumbStyle"
                    ></div>
                </div>
            </div>

            <div class="hue-row">
                <div class="controls">
                    <input
                        type="text"
                        v-model.trim="hex"
                        @change="onHexChange"
                        @keydown.enter="onHexChange"
                        aria-label="Code hexadécimal"
                    />
                </div>
            </div>

            <div class="palette">
                <template
                    v-for="(palette, category) in sample"
                    :key="category"
                >
                    <h3>{{ category }}</h3>
                    <div class="swatches">
                        <div
                            v-for="c in palette"
                            :key="c"
                            :class="['sw', { active: hex === c }]"
                            :style="{ background: c }"
                            @click="setFromHex(c)"
                            @keydown.enter="setFromHex(c)"
                            tabindex="0"
                            :title="c"
                        ></div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    border-bottom-left-radius: 14px;
    border-bottom-right-radius: 14px;
    padding: 21px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.label {
    font-size: 12pt;
    letter-spacing: 0.8px;
    color: #3b3b3b;
    font-weight: 600;
}

.palette-select {
    display: flex;
    gap: 16px;
}

.sv {
    width: 130px;
    height: 130px;
    border-radius: 12px;
    position: relative;
    cursor: crosshair;
    border: 2px solid #e2e8f0;
    transition: border-color 0.2s ease;
}

.sv:hover {
    border-color: #8b5cf6;
}

.sv .thumb {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1);
    pointer-events: none;
    transition: transform 0.1s ease;
}

.sv:active .thumb {
    transform: translate(-8px, -8px) scale(1.1) !important;
}

.hue {
    height: 130px;
    width: 28px;
    border-radius: 12px;
    cursor: pointer;
    border: 2px solid #e2e8f0;
    position: relative;
    transition: border-color 0.2s ease;
}

.hue:hover {
    border-color: #8b5cf6;
}

.hue .hthumb {
    position: absolute;
    width: 100%;
    height: 8px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1);
    pointer-events: none;
}

.hue-row {
    display: flex;
    gap: 12px;
    align-items: center;
}

.controls {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    width: 100%;
}

input[type="text"] {
    padding: 6px 8px;
    border-radius: 10px;
    border: 2px solid #e2e8f0;
    font-family: 'Monaco', 'Menlo', monospace;
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    transition: all 0.2s ease;
    background: #f8fafc;
}

input[type="text"]:hover {
    border-color: #cbd5e1;
    background: #ffffff;
}

input[type="text"]:focus {
    outline: none;
    border-color: #8b5cf6;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.palette h3 {
    margin: 10px 0 12px 0;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #8b5cf6;
}

.palette h3:first-child {
    margin-top: 0;
}

.swatches {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.sw {
    width: 35px;
    height: 35px;
    border-radius: 10px;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.sw::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.sw:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1;
}

.sw:hover::before {
    opacity: 1;
}

.sw:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
    transform: scale(1.05);
    z-index: 2;
}

.sw.active {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
    transform: scale(1.05);
    z-index: 2;
}
</style>