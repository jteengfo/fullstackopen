import PropType from 'prop-types'

const LoginForm = ({
  // destructuring
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <h2>Log in to application</h2>
        <div>
                Username<span> </span>
          <input
            data-testid= 'username'
            type='text'
            value={username}
            name='Username'
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          Password <span> </span>
          <input
            data-testid='password'
            type='password'
            value={password}
            name='Password'
            onChange={handlePasswordChange}
          />
        </div>
        <button>Login</button>
      </form>
    </div>
  )
}

LoginForm.PropType ={
  handleSubmit: PropType.func.isRequired,
  handleUsernameChange: PropType.func.isRequired,
  handlePasswordChange: PropType.func.isRequired,
  username: PropType.string.isRequired,
  password: PropType.string.isRequired
}

export default LoginForm