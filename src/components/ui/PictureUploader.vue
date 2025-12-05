<script setup>
import { ref, computed } from 'vue'
import ButtonRemoveItem from "../ui/ButtonRemoveItem.vue"
import CropModal from "./CropModal.vue"
import uploadIcon from '@icons/upload.svg'
import { getDefaultPicture } from '../../utils/defaultImage'
import {
    validateFileSize,
    validateFileType,
    fileToBase64,
    compressImage
} from '../../utils/imageUtils';

const picture = defineModel({ type: Object, required: true })
const fileInputRef = ref(null)
const showCropModal = ref(false)
const tempImageSrc = ref('')
const error = ref('')
const isProcessing = ref(false)

const displayImage = computed(() =>
    picture.value.path && picture.value.path !== ''
        ? picture.value.path
        : getDefaultPicture('female')
)

const isDisabled = () => !picture.value.path || picture.value.path === ""

const removePicture = () => {
    picture.value.path = ""
    error.value = ''
}

const uploadPicture = async (e) => {
    error.value = ''
    const file = e.target.files[0]

    if (!file) return

    // Validation du type
    const typeValidation = validateFileType(file, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
    if (!typeValidation.valid) {
        error.value = typeValidation.error
        e.target.value = ''
        return
    }

    // Validation de la taille (5 Mo max)
    const sizeValidation = validateFileSize(file)
    if (!sizeValidation.valid) {
        error.value = sizeValidation.error
        e.target.value = ''
        return
    }

    isProcessing.value = true

    try {
        // Conversion en base64
        const base64 = await fileToBase64(file)

        // Compression initiale si l'image est très grande
        const compressed = await compressImage(base64, 0.9, 1920, 1920)

        tempImageSrc.value = compressed
        showCropModal.value = true
    } catch (err) {
        error.value = 'Erreur lors du traitement de l\'image'
        console.error(err)
    } finally {
        isProcessing.value = false
        e.target.value = ''
    }
}

const handleCrop = (croppedBase64) => {
    picture.value.path = croppedBase64
    showCropModal.value = false
    tempImageSrc.value = ''
    error.value = ''
}

const closeCropModal = () => {
    showCropModal.value = false
    tempImageSrc.value = ''
}

const triggerFileInput = () => {
    if (isProcessing.value) return
    fileInputRef.value?.click()
}
</script>

<template>
    <div class="picture-container">
        <div
            class="image-wrapper"
            :style="{ borderRadius: picture.imageBorderRadius + '%' }"
        >
            <img
                :src="displayImage"
                class="picture"
                :style="{ borderRadius: picture.imageBorderRadius + '%' }"
                alt="user_picture"
                @click="triggerFileInput"
            />

            <input
                ref="fileInputRef"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                @change="uploadPicture"
                style="display: none;"
            />

            <div
                class="upload-overlay"
                @click="triggerFileInput"
                :class="{ processing: isProcessing }"
            >
                <div
                    v-if="isProcessing"
                    class="processing-content"
                >
                    <div class="spinner"></div>
                    <span>Traitement...</span>
                </div>
                <img
                    v-else
                    :src="uploadIcon"
                    alt="upload_icon"
                    class="upload-icon"
                />
            </div>

            <input
                class="radiusAdjuster"
                type="range"
                v-model.number="picture.imageBorderRadius"
                min="2"
                max="50"
                v-show="!isDisabled()"
            />
        </div>

        <ButtonRemoveItem
            :show="!isDisabled()"
            :class="['remove-btn', { disabled: isDisabled() }]"
            @click="removePicture()"
        />

        <div
            v-if="error"
            class="error-message"
        >
            {{ error }}
        </div>

        <CropModal
            :show="showCropModal"
            :image-src="tempImageSrc"
            :compression-quality="0.8"
            @crop="handleCrop"
            @close="closeCropModal"
        />
    </div>
</template>

<style scoped>
.picture-container {
    position: relative;
}

.image-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.sidebar .picture-container {
    max-width: 88%;
    align-self: center;
}

/* 
.template-air .sidebar .picture-container {
    max-width: 80%;
    align-self: end;
    margin-right: 12px;
} */

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
    z-index: 2;
    cursor: pointer;
    transition: opacity 0.3s ease;
}

.image-wrapper:hover .radiusAdjuster {
    opacity: 0.8;
}

.upload-overlay {
    position: absolute;
    inset: 0;
    background: rgba(223, 223, 223, 0.6);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.upload-overlay.processing {
    opacity: 0.95;
    cursor: wait;
}

.image-wrapper:hover .upload-overlay {
    opacity: 0.95;
}

.upload-overlay .upload-icon {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.processing-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.processing-content span {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
}

.spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e5e7eb;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.remove-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    opacity: 0;
    z-index: 2;
    transition: opacity 0.3s ease;
}

.picture-container:hover .remove-btn {
    opacity: 0.9;
}

.picture-container:hover .remove-btn:hover {
    opacity: 1;
    transform: scale(1.1);
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.image-wrapper:hover .radiusAdjuster:hover {
    opacity: 1;
}

.error-message {
    position: absolute;
    bottom: -40px;
    left: 0;
    right: 0;
    padding: 8px 12px;
    background: #fee;
    border: 1px solid #fcc;
    border-radius: 6px;
    color: #c00;
    font-size: 12px;
    text-align: center;
    z-index: 3;
}
</style>