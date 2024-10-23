export type AttendanceCreateRequest = {
    driver_id: string;
    check_in_time: Date;
    check_out_time: Date | null;
    status: string;
};

export type AttendanceUpdateRequest = {
    driver_id: string;
    check_in_time: Date;
    check_out_time: Date | null;
    status: string;
};
