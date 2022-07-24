
export interface User {

    userId: number
    firstName: string
    lastName: string
    login: string
    org: string,
    role: 'User' | 'Manager'
    status: 'Active' | 'Inactive'
}


