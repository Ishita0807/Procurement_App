export type AuthResponse = {
    access_token: string;
    refresh_token: string;
};
export type UserResponse = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    supplierFiles: {
        originalFileUrl: string;
        processedFileUrl: string;
    }[];
};