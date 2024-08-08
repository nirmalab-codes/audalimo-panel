export type SendNotificationRequest = {
    driver_id: string,
    user_id: string,
    step: string,
    message: string,
    title: string
    content: string,
    status: string,
    withEmail: boolean
};