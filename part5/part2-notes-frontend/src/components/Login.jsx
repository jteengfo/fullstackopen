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
                    type='text'
                    value={username}
                    name='Username'
                    onChange={handleUsernameChange}
                />
                </div>
                <div>
                Password <span> </span>
                <input
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

export default LoginForm