
import React, { useState } from 'react';

const FirstPage = (
    {islogin = true}
) => {
   const [data,setData] = useState({

    name:"",
    ...(islogin?{}:{email:""}),
    
    password:"",
    
   });
  return (
    <div className='h-screen w-full   justify-center items-center bg-slate-300 '>
      <h2 className='bg-slate-50  flex-direction:col space-x-6 space-'>Want to join?
     {
        islogin && (
            <button className='bg-slate-500 '> Sign in</button>
        )
     }
      </h2>
    <form className='flex flex-col gap-9 pb-10'>
    <label htmlFor="name">Name</label>
        <input 
        
        label="Name"
        name='name'
        type='name'
        placeholder='jerin...'
        className='bg-slate-200'
        
        />
      {
        !islogin && (
            <>
            <label htmlFor="email">Email</label>
            <input 
            label="Email"
            name='email'
            type='email'
            placeholder='jerin@gmail.com'
            className='bg-slate-200'
            
            />
         </>
        )
      }
        
        <label htmlFor="password">Password</label>
          <input 
        label="Password"
        name='password'
        type='password'
        placeholder='AB67@ah'
        className='bg-slate-200'
        
        />
    </form>

      {
        islogin?( <button className='bg-slate-500  '>log in </button>):(
            <button className='bg-slate-500 '> Sign in</button>
        )
      }
     
     
    </div>
  );
}

export default FirstPage;
