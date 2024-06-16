import { type BaseDto, type ListResponse } from "./Base.response";

export type UploadDto = BaseDto & {
  key_file: string,
  filename: string,
  mimetype: string,
  size: number,
  signed_url: string,
  expiry_date_url: string | null,
}

export type UploadListResponse = ListResponse<UploadDto>
