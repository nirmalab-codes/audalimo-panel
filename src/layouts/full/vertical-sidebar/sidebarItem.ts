import {
    CalendarIcon,
    ChartLineIcon,
    FileTextIcon,
    GpsIcon,
    NotificationIcon,
    UserPlusIcon
} from 'vue-tabler-icons';

export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    chipBgColor?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
}

const sidebarItem: menu[] = [
    { header: 'Home' },
    {
        title: 'Dashboard',
        icon: ChartLineIcon,
        to: '/dashboards'
    },
    {
        title: 'Driver',
        icon: UserPlusIcon,
        to: '/apps/driver'
    },
    {
        title: 'Location',
        icon: GpsIcon,
        to: '/apps/location'
    },
    {
        title: 'Documents',
        icon: FileTextIcon,
        to: '/apps/documents'
    },
];

export default sidebarItem;
