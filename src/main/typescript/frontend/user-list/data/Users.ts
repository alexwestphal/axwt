import {User} from './User'
import {ArrayUtils} from '@axwt/util'

export const Users: User[] = [
    {
        userId: 12022, firstName: 'Amos', lastName: 'Burton', login: 'amos.burton',
        org: "Customer A", role: 'User', status: 'Active'
    },
    {
        userId: 12033, firstName: 'James', lastName: 'Holden', login: 'james.holden',
        org: "Customer A", role: 'Manager', status: 'Active'
    },
    {
        userId: 12044, firstName: 'Naomi', lastName: 'Nagata', login: 'naomi.nagata',
        org: "Customer A", role: 'User', status: 'Active'
    },
    {
        userId: 12055, firstName: 'Alex', lastName: 'Kamal', login: 'alex.kamal',
        org: "Customer A", role: 'User', status: 'Active'
    },
    {
        userId: 12066, firstName: 'Klaes', lastName: 'Ashford', login: 'klaes.ashford',
        org: "Customer A", role: 'Manager', status: 'Active'
    },
    {
        userId: 12077, firstName: 'Camina', lastName: 'Drummer', login: 'camina.drummer',
        org: "Customer A", role: 'User', status: 'Active'
    },
    {
        userId: 12088, firstName: 'Anderson', lastName: 'Dawes', login: 'anderson.dawes',
        org: "Customer A", role: 'Manager', status: 'Active'
    },
]

export const Orgs = ArrayUtils.distinct(Users.map(user => user.org))

export const getUser = (userId: number): User => {

    for(let i=0; i<Users.length; i++) {
        if(Users[i].userId == userId) return Users[i]
    }
    return null
}