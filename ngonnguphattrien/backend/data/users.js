import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'admin user',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: 'Phu',
        email: 'phu@gmail.com',
        password: bcrypt.hashSync('123456', 10),
    },
    {
        name: 'Yen',
        email: 'yen@gmail.com',
        password: bcrypt.hashSync('123456', 10),
    },
]
export default users