import bcrypt from 'bcryptjs'

const users = [
    {
        name: "Admin User",
        email: 'admin@example.com',
        phone_no: 123456789,
        password: bcrypt.hashSync('123456',10),
        isAdmin: true
    },
    {
        name: "Haseeb Biya",
        email: 'user@example.com',
        phone_no: 123456789,
        password: bcrypt.hashSync('123456',10)
    },

]

export default users