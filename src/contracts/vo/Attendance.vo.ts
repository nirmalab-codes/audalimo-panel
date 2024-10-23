export function getDefaultAttendanceVo(): AttendanceVo {
    return {
        id: '',
        driver_id: '',
        check_in_time: new Date(),
        check_out_time: null,
        status: 'active',
    };
}

export type AttendanceVo = {
    id: string;
    driver_id: string;
    check_in_time: Date;
    check_out_time: Date | null;
    status: string;
};
