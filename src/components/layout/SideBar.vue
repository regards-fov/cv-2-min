<script setup>
import { computed } from 'vue'
import PictureUploader from "../ui/PictureUploader.vue";
import TextareaSection from "../ui/TextareaSection.vue"
import PersonalInfo from '../blocks/PersonalInfo.vue';
import ContactInfo from '../blocks/ContactInfo.vue';
import SkillsList from '../blocks/SkillsList.vue';
import LanguagesList from '../blocks/LanguagesList.vue';
import colorWheel from '@icons/colorWheel.svg'

const props = defineProps({
	cvData: {
		type: Object,
		required: true,
	}
});

const $userData = computed(() => props.cvData);

const emit = defineEmits(["update:cvData", "toggleColorWheel"]);

const handleSidebarResize = (event) => {
	emit("update:cvData", {
		...props.cvData,
		configuration: {
			...props.cvData.configuration,
			sidebar: {
				...props.cvData.configuration.sidebar,
				size: event.detail.sidebarWidth,
			}
		}
	});
};

const handleClick = (e) => {
	if (e.target !== e.currentTarget) return;
	emit('toggleColorWheel')
}

</script>
<template>
	<div
		id="sidebar"
		class="sidebar"
		v-wcag-adapter="props.cvData.configuration.sidebar.color || '#62b1c9'"
		v-sidebar-resizer="{
			userWidth: props.cvData.configuration.sidebar.size,
		}"
		@sidebar-resized="handleSidebarResize"
	>
		<div class="personnal-container">

			<div
				class="topbox box-color"
				@click="handleClick"
			></div>

			<PersonalInfo v-model="$userData" />

			<PictureUploader v-model="$userData.cv.picture" />
		</div>

		<div
			class="infos box-color"
			v-color-wheel="colorWheel"
			@click="handleClick"
		>

			<ContactInfo />

			<SkillsList />

			<LanguagesList />

			<div class="block hobbies">
				<div class="sidebar-label">
					CENTRES D'INTÉRÊT
				</div>
				<TextareaSection
					v-model="$userData.cv.hobbies"
					name="hobbies"
					placeholder="Vos centres d'intêret"
				/>
			</div>
		</div>
	</div>

</template>
<style lang="scss" scoped>
.personnal-container {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.topbox {
	height: 16px;
	border-bottom-left-radius: var(--sidebar-radius);
	border-bottom-right-radius: var(--sidebar-radius);
}

.box-color {
	background-color: var(--main-color);
}

// .template-air .box-color {
//   background-color: transparent;
// }

.box-color:hover {
	box-shadow: 0 0 0 2px rgb(112, 181, 255),
		6px 0 12px -3px rgba(112, 181, 255, 0.3),
		-4px 0 6px -3px rgba(112, 181, 255, 0.1);

	transition: .2s;
}

.sidebar {
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-start;
	width: var(--sidebar-width);
	gap: 10px;
}

.infos {
	flex: 1;
	border-radius: var(--sidebar-radius);
	white-space: normal;
	word-break: break-word;
}

:deep(.sidebar-label) {
	font-size: larger;
	font-weight: bold;
	margin-bottom: 6px;
}

.block {
	border-radius: 6px;
	margin: 14px 12px 4px 12px;
}

.hobbies {
	.textarea-section {
		padding: 2px;
	}
}

#hobbies {
	font-size: 11pt;
}

:deep(ul) {
	padding: 0;

	&>* {
		font-size: 11pt;
	}
}

:deep(.list) {
	display: flex;
	flex-direction: column;
	margin: 4px 0 -8px 0px;
	gap: 3px;

	li {
		position: relative;
		list-style: none;
		margin-right: -10px;
		padding-right: 10px;

		.removeItem {
			position: absolute;
			display: flex;
			top: 0;
			right: 0;
			height: 100%;
			align-items: center;

			&::before {
				content: '';
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: -18px;
				margin-left: 11px;
			}
		}

		&:hover .removeItem,
		.removeItem:hover {
			opacity: 1;
			transform: translateX(86%);
		}
	}

	& p {
		margin: 0 0;
	}
}
</style>