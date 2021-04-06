import {createContext, useState, ReactNode, useEffect } from 'react';

import { toast } from 'react-toastify';

import Cookies from 'js-cookie';

import api from '../services/api';

import { useRouter } from 'next/router';

interface AuthContextData {
    handleSubmit: (data: object) => void;
    handleExit: (data: object) => void;
    getCompany: (data: object) => void;
    getUser: (data: object) => void;
    token: string;
    user: object;
    loading: boolean;
    signed: boolean;
    company: number;
    company_name: string;
}

interface AuthProviderProps {
    children: ReactNode;
    user: object;
    token: string;
    loading: boolean;
    signed: boolean;
    company: number;
    company_name: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children, ...rest }: AuthProviderProps) {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [token, setToken] = useState('');
    const [signed, setSigned] = useState(false);
    const [company, setCompany] = useState(0);
    const [company_name, setCompanyName] = useState('');
    const [userNickname, setUserNickname] = useState('');
    const [userId, setUserId] = useState();
    
    useEffect(() => {
        const response = Cookies.get('token');
        const responseCompany = Cookies.get('company');
        const responseUser = Cookies.get('name');
        const responseCompanyName = Cookies.get('companyname');
        const responseUserId = Cookies.get('userid');

        if (!responseCompany) {
            router.push({
                pathname: '/',
            });
        } else {
            setCompany(responseCompany);
            setUserNickname(responseUser);
            setCompanyName(responseCompanyName);
            setUserId(responseUserId);
        }

        if (response) {
            setToken(response);
            api.defaults.headers.Authorization = `Bearer ${token}`;
        }
    }, []);

    async function handleExit() {
        setSigned(false);

        Cookies.remove('token');
        Cookies.remove('name');
        Cookies.remove('company');
        Cookies.remove('companyname');
        Cookies.remove('userid');

        router.push({
            pathname: '/',
        });
    }

    async function getCompany(id, name) {
        setCompany(id);
        setCompanyName(name)
        Cookies.set('companyname', String(name));
        
    }

    async function getUser(id, name) {
        setUserNickname(name);
        setUserId(id);

        Cookies.set('userid', String(id));
    }

    

    async function handleSubmit(data) {
        try {
            setLoading(true);

            const response = await api.post('/sessions', {
                nickname: userNickname,
                password: data.password,
            });
    
            const { token, user } = response.data;
    
            api.defaults.headers.Authorization = `Bearer ${token}`;

            Cookies.set('name', String(user.nickname));
            Cookies.set('token', String(token));
            Cookies.set('company', String(company));

            setToken(token);
            setUser(user);
            setUserNickname(user.nickname);
            setLoading(false);
            setSigned(true);

            router.push('/Orders/ListOrders');

        } catch (error) {
            toast.error('Falha na autenticação, verifique seus dados');
            setLoading(false);
            return;
        }
    }

    return (
        <AuthContext.Provider 
            value={{             
                handleSubmit, 
                handleExit, 
                token,
                user,
                userNickname,
                userId,
                loading,   
                signed,  
                getCompany,
                getUser,
                company,  
                company_name,                   
              }}
            >

            {children}
                        
        </AuthContext.Provider>
    );
}