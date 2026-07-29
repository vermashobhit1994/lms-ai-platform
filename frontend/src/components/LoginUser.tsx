import { getAccessToken, setAccessToken } from '../store/authStore'


async function getCurrentUser() {
    const accessToken = getAccessToken();
    console.log("access token: ", accessToken);
    const response = await fetch(
        "http://localhost:3000/api/v1/auth/me",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
        }
    );

    const data = await response.json();
    console.log(data);
    if (!response.ok) {
        throw new Error(
            data?.error?.message ??
            "Failed to fetch user profile"
        );
    }

    return data;
}

const LoginUser = () => {
    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
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
                credentials: "include",
            })
            data = await res.json();
            if (!res.ok) {
                throw ({
                    status: res.status,
                    data
                })

            }
            console.log('Login successful:', data)
            setAccessToken(data.access_token);

        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) {
                console.error(error.message)
            } else if (typeof error === "object" && error !== null && "status" in error) {
                console.error("Login failed ", data);
            } else {
                console.error("something went wrong")
            }

        }
    }
    const refreshLoginHandler = async () => {
        console.log("refresh login handler");
        try {

            const response = await fetch("http://localhost:3000/api/v1/auth/refresh", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            });
            console.log(response.headers.get("content-type"));

            // const data = await response.json();
            // console.log("recieved data", data);
            if (response.headers.get("content-type") === "text/html; charset=utf-8") {

                console.log(response.status);
                console.log(response.headers.get("content-type"));
                const text = await response.text()
                console.log(text);

            } else if ((response.headers.get("content-type") === "application/json; charset=utf-8")) {
                const data = await response.json();
                console.log(data);
                setAccessToken(data.access_token);

            }

        } catch (error) {
            console.error(error);
        }
    }

    const logoutHandler = async () => {
        console.log("logout handler");
        try {

            const response = await fetch("http://localhost:3000/api/v1/auth/logout", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            });

            console.log(response.headers.get("content-type"));
            if (response.headers.get("content-type") === "text/html; charset=utf-8") {

                console.log(response.status);
                console.log(response.headers.get("content-type"));
                const text = await response.text()
                console.log(text);

            } else if ((response.headers.get("content-type") === "application/json; charset=utf-8")) {
                const data = await response.json();
                console.log(data);

            }

        } catch (error) {
            console.error(error);
        }
    }

    const userProfileHandler = async () => {
        const profile = await getCurrentUser();
        console.log(profile);
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
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            <button type="button" onClick={refreshLoginHandler}>Refresh</button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button type="button" onClick={logoutHandler}>Logout</button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            <button type="button" onClick={userProfileHandler}>Get profile</button>

        </form>

    )
}

export default LoginUser
