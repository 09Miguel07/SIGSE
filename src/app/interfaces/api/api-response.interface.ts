export interface ModelApiResponseDto<T> {
  success: boolean;
  message: string;
  data: T | null;
}
