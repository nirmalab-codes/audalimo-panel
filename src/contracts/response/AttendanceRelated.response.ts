import { type BaseDto } from './Base.response';

export type AttendanceDto = BaseDto & {
    driver_id: string;
    check_in_time: Date;
    check_out_time: Date | null;
    status: string;
};
