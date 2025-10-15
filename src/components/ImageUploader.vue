<script setup>

const path = defineModel('path', { type: String })
const imageBorderRadius = defineModel('imageBorderRadius', { type: Number, default: 2 })

const isDisabled = () => path.value === "https://placehold.co/300x300?text=Photo"

const uploadPicture = (e) => {
    const file = e.target.files.item(0)
    if (!file || !file.type.match('image.*')) return

    const reader = new FileReader()
    reader.onload = (event) => {
        path.value = event.target.result
        e.target.value = ''
    }
    reader.readAsDataURL(file)
}

</script>
<template>
    <div class="picture_container">
        <div class="image-wrapper">
            <img
                :src="path"
                class="picture"
                :style="{ borderRadius: imageBorderRadius + '%' }"
                alt="user_picture"
            />

            <div class="btns_container">
                <label
                    for="user-picture"
                    class="image-btn custom-file-upload green"
                >
                    <input
                        id="user-picture"
                        type="file"
                        accept="image/*"
                        @change="uploadPicture"
                    >
                    {{ isDisabled() ? '+' : '↻' }}
                </label>

                <div
                    id="red"
                    class="image-btn red"
                    :class="{ disabled: isDisabled() }"
                    @click="!isDisabled() && (path = 'https://placehold.co/300x300?text=Photo')"
                >−</div>
            </div>

            <input
                class="radiusAdjuster"
                type="range"
                v-model.number="imageBorderRadius"
                min="2"
                max="50"
                v-show="!isDisabled()"
            />
        </div>
    </div>
</template>

<style scoped>
.image-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin-bottom: 4px;
}

.sidebar .picture_container {
    max-width: 89%;
    align-self: center;
}

input[type="file"] {
    display: none;
}

.picture {
    width: 100%;
    cursor: pointer;
    height: auto;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    transition: border-radius 0.1s ease;
}

.radiusAdjuster {
    position: absolute;
    bottom: 10px;

    width: 40%;
    opacity: 0;
    z-index: 3;
    cursor: pointer;
    transition: opacity 0.3s ease;
}

.image-wrapper:hover .radiusAdjuster {
    opacity: 0.6;
}

.image-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.3);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
}

.image-wrapper:hover::before {
    opacity: 0.9;
}

.btns_container {
    position: absolute;
    display: flex;
    gap: 8px;
    top: 14px;
}

.image-btn {
    width: 25px;
    height: 25px;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 18px;
    color: white;
    opacity: 0;
    z-index: 2;
    transition: opacity 0.3s ease;
    cursor: pointer;
    box-shadow: var(--box-shadow-base);
}

.image-btn.green {
    background-color: #55B39A;
}

.image-btn.red {
    background-color: #B36B55;
}

#red.disabled {
    cursor: default;
    background-color: grey;
    box-shadow: none;
    transform: none;
    /* opacity: 0.9; */
}

.image-wrapper:hover .image-btn {
    opacity: 0.9;
    pointer-events: auto;
}

.image-wrapper:hover .image-btn:hover {
    opacity: 1;
    box-shadow: var(--box-shadow-hover);
    transform: scale(1.1);
    transition: opacity 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.image-wrapper:hover .radiusAdjuster:hover {
    opacity: 1;
}
</style>