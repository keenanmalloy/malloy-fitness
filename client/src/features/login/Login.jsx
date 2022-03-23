import { useRouter } from 'next/router';
import React from 'react';
import { Button } from 'features/common/Button';

const Login = () => {
const router = useRouter()
  const handleSubmit = () => {
    router.push('http://localhost:4000/auth/providers/google')
  }
       
  return (
    <div className='flex items-center'>
        <Button onClick={handleSubmit}>Login</Button>
    </div>
  )
}

export default Login