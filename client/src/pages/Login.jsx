import { useState } from 'react';
import '../styles/Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
 const url = isLogin
  ? `${import.meta.env.VITE_API_URL}/api/auth/login`
  : `${import.meta.env.VITE_API_URL}/api/auth/register`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (isLogin) {
          // Save token and redirect to dashboard
          localStorage.setItem('token', data.token);
          window.location.href = '/dashboard';
        } else {
          alert('Registration successful! Please login.');
          setIsLogin(true);
        }
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (error) {
      alert('Error connecting to server');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>ShiftSync</h1>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
              />
              <input
                type="text"
                name="department"
                placeholder="Department (e.g., ICU, ER)"
                value={formData.department}
                onChange={handleChange}
                required={!isLogin}
              />
            </>
          )}
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <button type="submit" className="btn-primary">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            className="toggle-link" 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>

        {isLogin && (
          <p className="forgot-password">
            <span className="toggle-link">Forgot Password?</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;