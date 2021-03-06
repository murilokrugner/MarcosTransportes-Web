import { useState, useEffect, useRef, useContext } from 'react';

import api from '../../../services/api';
import apiZipcode from '../../../services/apiZipcode';

import { AuthContext } from '../../../context/AuthContext';
import styles from '../../../styles/components/Forms/FormDescriptionOnly.module.css';
import * as Yup from 'yup';
import { Form, Input } from '@rocketseat/unform';
import ReactSelect from 'react-select';

import stylesLoading from '../../../styles/components/Loading.module.css';

import HashLoader from "react-spinners/HashLoader";     

import { cnpj as validateCnpj, cpf as validateCpf } from 'cpf-cnpj-validator';

import { useRouter } from 'next/router';



import { toast } from 'react-toastify';

const schema = Yup.object().shape({
    nickname: Yup.string().required('obrigatório'),
    password: Yup.string().required('obrigatório'),
  });

export default function FormUser({ address }) {
    const router = useRouter();

    const { token, company } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const [code, setCode] = useState(0);
    const [loadingCode, setLoadingCode] = useState(false);
    
    async function loadCode() {
        const response = await api.get(`${address}-code?company=${company}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setCode(response.data + 1);

        setLoadingCode(false);
        setLoading(false); 
    };

    (code);

    useEffect(() => {      
        if (token) {
            loadCode();
        }


    }, [token]);

    async function handleSubmit(data) {  
        if (data.password !== data.password2) {
            toast.error('As senhas não são iguais');
            return;
        }  
        
        if (data.password.lenght <= 6) {
            toast.error('Senha muito curta, é necessario uma senha com no minimo 6 digitos');
            return;
        }

        try {
            const response = await api.post(`${address}?company=${company}`, {
                nickname: data.nickname,
                password: data.password,                            
            }, {
                headers: { Authorization: `Bearer ${token}` }  
            });

            toast.success('Cadastro realizado com sucesso!');

            router.back();

        } catch (error) {
            if (error.response.status === 400) {
                toast.info('Já existe um usuario cadastrado com esse nick');
                setLoading(false);
                return
            }         

            toast.error('Erro ao realizar o cadastro');
            setLoading(false);
        }
        
    }

    return (
        <div className={styles.Container}>
            {loading && loadingCode ? (
                <>
                    <div className={stylesLoading.Container}>
                        <HashLoader color='#fff' loading={loading} size={60} />
                    </div>
                </>
            ) : (
                <div className={styles.containerForm}>
    
                    <Form onSubmit={handleSubmit} >
                    <Input name="code" type="text" placeholder="Código" value={code} disabled />
                    <Input
                        name="nickname"
                        type="text"
                        placeholder="Nome do Usuário"
                    />
                    <Input
                        name="password"
                        type="password"
                        placeholder="Senha"
                    /> 
                    <Input
                        name="password2"
                        type="password"
                        placeholder="Confirmar Senha"
                    />
                                        
                    <button type="submit">{loading ? 'Carregando...' : 'Gravar'}</button>

                    </Form>
                </div>
            )}
        </div>
    );
}