import { defineStore } from 'pinia';
// project imports
import { type AttendanceCreateRequest, type AttendanceUpdateRequest } from '@/contracts/request/AttendanceRelated.request';
import { type BaseResponse, type ListResponse, type SingleResponse } from '@/contracts/response/Base.response';
import { type AttendanceDto } from '@/contracts/response/AttendanceRelated.response';
import { type AttendanceVo } from '@/contracts/vo/Attendance.vo';
import ApiService from '@/services/ApiService';
import { toast } from 'vue3-toastify';

export const useAttendanceStore = defineStore({
    id: 'Attendance',
    state: () => ({
        attendances: [] as Array<AttendanceVo>
    }),
    getters: {},
    actions: {
        async fetchAttendances() {
            const rawResponse = await ApiService.query('/v1/attendance', {});
            const parsedResponse = rawResponse.data as ListResponse<AttendanceDto>;
            const attendances: Array<AttendanceVo> = parsedResponse.data.map((attendance) => {
                return attendance;
            });
            this.attendances = attendances;
        },
        async createAttendance(attendance: AttendanceVo) {
            const payload: AttendanceCreateRequest = toCreateRequest(attendance);
            const rawResponse = await ApiService.post('/v1/attendance', payload);
            const parsedResponse = rawResponse.data as SingleResponse<AttendanceDto>;
            if (rawResponse.status === 201) {
                toast.success(parsedResponse.message);
                await this.fetchAttendances();
            }
        },
        async updateAttendance(attendance: AttendanceVo) {
            const payload: AttendanceUpdateRequest = toUpdateRequest(attendance);
            const rawResponse = await ApiService.put(`/v1/attendance/${attendance.id}`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<AttendanceDto>;
            if (rawResponse.status === 200) {
                toast.success(parsedResponse.message);
                await this.fetchAttendances();
            }
        },
        async deleteAttendance(attendanceId: string) {
            const rawResponse = await ApiService.delete(`/v1/attendance/soft-delete/${attendanceId}`);
            const parsedResponse = rawResponse.data as BaseResponse;
            if (rawResponse.status === 200) {
                toast.success(parsedResponse.message);
                await this.fetchAttendances();
            }
        }
    }
});

function toCreateRequest(attendance: AttendanceVo): AttendanceCreateRequest {
    return {
        driver_id: attendance.driver_id,
        check_in_time: attendance.check_in_time,
        check_out_time: attendance.check_out_time,
        status: attendance.status,
    };
}

function toUpdateRequest(attendance: AttendanceVo): AttendanceUpdateRequest {
    return {
        driver_id: attendance.driver_id,
        check_in_time: attendance.check_in_time,
        check_out_time: attendance.check_out_time,
        status: attendance.status,
    };
}
