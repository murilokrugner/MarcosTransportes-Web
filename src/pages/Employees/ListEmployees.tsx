import styles from '../../styles/pages/Devices/ListDevices.module.css'

import Header from '../../components/Header';

import ListData from '../../components/Forms/ListData';

import { useRouter } from 'next/router';

export default function ListEmployees() {
    const router = useRouter();

    return (
        <div className={styles.Container}>
            <Header />

            <h2>Funcionarios</h2>   

           

            <ListData address={'employees'}/>

        </div>
    );
}