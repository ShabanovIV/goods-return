import { EndpointRequestForm } from 'src/features/ExecuteEndpointRequest';
import s from './RequestConsolePage.module.scss';

const RequestConsolePage = () => {
  return (
    <main className={s.page}>
      <section className={s.card}>
        <EndpointRequestForm />
      </section>
    </main>
  );
};

export default RequestConsolePage;
