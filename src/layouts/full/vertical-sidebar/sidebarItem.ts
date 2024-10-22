import { useAuthStore } from '@/stores/auth';
import ConstRole from '@/utils/constrole';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { CalendarIcon, CarIcon, ChartLineIcon, FileTextIcon, GpsIcon, NoteIcon, NotificationIcon, UserIcon, UserPlusIcon } from 'vue-tabler-icons';

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
    { header: 'Onboarding' },
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
    }
    // { header: 'Settings' },
    // {
    //     title: 'Users',
    //     icon: UserIcon,
    //     to: '/apps/user'
    // },
];

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

if ([ConstRole.ID_SUPER_ADMIN, ConstRole.ID_ADMIN].some((roleId) => user.value.role_id === roleId)) {
    sidebarItem.push(
        { header: 'Management' },
        {
            title: 'Vehicle',
            icon: CarIcon,
            to: '/apps/vehicle'
        },
        {
            title: 'Trip',
            icon: NoteIcon,
            to: '/apps/trip'
        }
    );
}

if (user.value.role_id === ConstRole.ID_SUPER_ADMIN) {
    sidebarItem.push(
        { header: 'Settings' },
        {
            title: 'Users',
            icon: UserIcon,
            to: '/apps/user'
        }
    );
}

export default sidebarItem;
