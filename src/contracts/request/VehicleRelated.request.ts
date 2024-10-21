export type VehicleCreateRequest = {
  name: string
  registration_date: Date
  license_plate: string
  ownership: string
  vehicle_type: string
  rta_office: string
  driver_ids: Array<string>
  vehicle_drivers: Array<string>
  seat: number
}

export type VehicleUpdateRequest = {
  name: string
  registration_date: Date
  license_plate: string
  ownership: string
  vehicle_type: string
  rta_office: string
  driver_ids: Array<string>
  vehicle_drivers: Array<string>
  seat: number
}