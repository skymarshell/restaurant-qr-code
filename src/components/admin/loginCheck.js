import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//ใช้กับทุกหน้ายกเว้น login

// loginCheck();

function loginCheck() {


      const navigate = useNavigate();

      //ถ้า user ไม่ได้ login ให้เด้งไปหน้า login
      useEffect(() => {

            if (!localStorage.getItem('username')) {
                  navigate('/admin_login');
            }


      }, [navigate]);


}

export default loginCheck;
