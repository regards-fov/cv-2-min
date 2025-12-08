<script setup>
import { useLoginModal } from '@/composables/useLoginModal'
import LoginModal from './components/ui/LoginModal.vue'

const { isOpen } = useLoginModal()
</script>

<template>
	<main>
		<RouterView />

		<Teleport to="body">
			<LoginModal v-if="isOpen" />
		</Teleport>
	</main>
</template>

<style>
.modal-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
}
</style>
