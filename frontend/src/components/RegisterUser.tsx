

function RegisterUser() {


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const full_name = formData.get('full_name')
    const email = formData.get('email')
    const password = formData.get('password')
    const role = formData.get("role");

    console.log({ full_name, email, password, role })
    let data;

    try {
      const res = await fetch(`http://localhost:3000/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name,
          email,
          password,
          role
        }),
      })
      data = await res.json();
      if (!res.ok) {
        throw ({
          status: res.status,
          data
        })

      }
      console.log('Registration successful:', data)
    } catch (error) {
      console.log(error);
      if (error instanceof TypeError) {
        console.log(error.message)
      } else if (typeof error === "object" && error !== null && "status" in error) {
        console.log("Registration failed ", data);
      } else {
        console.log("something went wrong")
      }

    }
  }
  return (

    <form onSubmit={handleSubmit}>
      <label htmlFor=""> Enter full name &nbsp;
        <input name="full_name" type="text" placeholder="Name" required />
      </label>
      <br />
      <br />

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

      <label htmlFor="">select your role &nbsp;&nbsp;
        <input type="radio" name="role" id="" value="admin" required />
        <label htmlFor="">Admin</label>
        &nbsp;&nbsp;

        <input type="radio" name="role" id="" value="instructor" required />
        <label htmlFor="">Instructor</label>
        &nbsp;&nbsp;

        <input type="radio" name="role" id="" value="student" required />
        <label htmlFor="">Student</label>

      </label>
      <br />
      <br />
      <button type="submit">Submit</button>
      <br />
      <br />
      <br />
      <br />
    </form>
  )
}

export default RegisterUser;
