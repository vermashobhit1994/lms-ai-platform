import React from 'react'

const LoginUser = () => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email')
        const password = formData.get('password')

        let data;

        try {
            const res = await fetch(`http://localhost:3000/api/v1/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })
            data = await res.json();
            if (!res.ok) {
                throw ({
                    status: res.status,
                    data
                })

            }
            console.log('Login successful:', data)
        } catch (error) {
            console.log(error);
            if (error instanceof TypeError) {
                console.log(error.message)
            } else if (typeof error === "object" && error !== null && "status" in error) {
                console.log("Login failed ", data);
            } else {
                console.log("something went wrong")
            }

        }
    }
    return (

        <form onSubmit={handleSubmit}>

            <label htmlFor=""> Enter email Id &nbsp;
                <input name="email" type="email" placeholder="Email" required />
            </label>
            <br />
            <br />

            <label htmlFor=""> Enter password &nbsp;
                <input name="password" type="password" placeholder="Password" required />
            </label>
            <br />
            <br />

            <button type="submit">Submit</button>
        </form>

    )
}

export default LoginUser
