import iconExport from '@icons/export.svg';
import iconShare from '@icons/share.svg';
import iconReset from '@icons/reset.svg';
import iconDownload from '@icons/download.svg';
import iconColor from '@icons/color.svg';
import iconLayout from '@icons/layout.svg';
import iconTemplate from '@icons/template.svg';

export const propertiesPanelSections = [
    {
        id: 'actions',
        title: 'ACTIONS',
        color: '#3b82f6',
        separatorClass: 'user-separator',
        buttons: [
            {
                id: 'export',
                icon: iconExport,
                label: 'Exporter en PDF',
                tooltip: 'Exporter en PDF',
                action: 'exportToPDF'
            },
            {
                id: 'share',
                icon: iconShare,
                label: 'Partager votre CV',
                tooltip: 'Partagez votre CV',
                action: 'share'
            },
            {
                id: 'reset',
                icon: iconReset,
                label: 'Réinitialiser les données',
                tooltip: 'Réinitialiser les données',
                action: 'initCV'
            },
            {
                id: 'download',
                icon: iconDownload,
                label: 'Télécharger',
                tooltip: 'Télécharger',
                action: 'downloadJson',
                condition: 'isLocalhost'
            }
        ]
    },
    {
        id: 'design',
        title: 'DESIGN',
        color: '#8b5cf6',
        separatorClass: 'design-separator',
        expandable: {
            id: 'colorPicker',
            icon: iconColor,
            label: 'Couleur',
            tooltip: 'Modifier la barre latérale',
            component: 'ColorPicker'
        }
    },
    {
        id: 'layout',
        title: 'MISE EN FORME',
        color: '#c53c80',
        separatorClass: 'layout-separator',
        expandable: {
            id: 'layoutSelector',
            icon: iconLayout,
            label: 'Textes',
            tooltip: 'Modifier le format texte',
            component: 'LayoutConfigurator'
        }
    },
    {
        id: 'template',
        title: 'TEMPLATE',
        color: 'rgb(44 125 183)',
        separatorClass: 'template-separator',
        expandable: {
            id: 'templateSelector',
            icon: iconTemplate,
            label: 'Choix du template',
            tooltip: 'Choix du template',
            component: 'TemplateSelector',
        },
        templates: [
            { id: 'classic', label: 'Classique' },
            { id: 'air', label: 'Moderne' }
        ],
    }
];