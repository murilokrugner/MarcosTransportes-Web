import React, { useContext, useState } from 'react';
import * as Yup from 'yup';
import { Form, Input } from '@rocketseat/unform';

import styles from '../styles/components/SignIn.module.css';
import { AuthContext } from '../context/AuthContext';

const schema = Yup.object().shape({
    email: Yup.string()
      .email('Insira um e-mail válido')
      .required('O e-mail é obrigatório'),
    password: Yup.string().required('A senha é obrigatória'),
  });

export default function SignIn() {
    const { loading, handleSubmit } = useContext(AuthContext);
  
    return (
      <div className={styles.containerSignIn}>      
        <div className={styles.containerForm}>
            <img src='./logo.png' alt="logobela" height="500px" />
    
            <Form schema={schema} onSubmit={handleSubmit}>
            <Input name="email" type="email" placeholder="Seu e-mail" />
            <Input
                name="password"
                type="password"
                placeholder="Sua senha secreta"
            />
            <button type="submit">{loading ? 'Carregando...' : 'Acessar'}</button>

            </Form>
        </div>
    </div>
    );
  }