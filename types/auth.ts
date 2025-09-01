export type AuthResponse = {
    access_token: string;
    refresh_token: string;
};
export type UserResponse = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    supplierFiles: {
        id: string;
        originalFileUrl: string;
        processedFileUrl: string;
    }[];
};