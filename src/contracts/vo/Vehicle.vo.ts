export function getDefaultVehicleVo(): VehicleVo {
    return {
        id: '',
        name: '',
        registrationDate: new Date(),
        licensePlate: '',
        ownership: '',
        vehicleType: '',
        rtaOffice: '',
        driverIds: [],
        driverNames: [],
        seat: 0,
    };
}

export type VehicleVo = {
    id: string,
    name: string,
    registrationDate: Date,
    licensePlate: string,
    ownership: string,
    vehicleType: string,
    rtaOffice: string,
    driverIds: Array<string>,
    driverNames: Array<string>,
    seat: number,
}