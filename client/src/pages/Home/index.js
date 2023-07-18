import React, {useEffect, useState} from 'react';
import './styles.css';

import api from '../../services/api';

export default function Home() {
  
  const [valorTotal, setValorTotal] = useState('');
  let [valorTotalPeriodo, setValorTotalPeriodo] = useState('');
  const [transferencias, setTransferencias] = useState([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [nomeOperador, setNomeOperador] = useState('');

  async function buscar() {
    const response = await api.get('transferencias')
    setTransferencias(response.data)
  }

  //carrega os dados na inicialização
  useEffect(() => {
    //buscar();
  }, [])

  //buscar valor total
  async function buscarValorTotal(){
    try {
      const valorTotal = await api.get('transferencias/valorTotal');
      console.log(valorTotal.data)
      setValorTotal(valorTotal.data);
    } catch (err) {
      alert('Não foi possível buscar os dados, verifique sua conexão!');
    }
  }

  //buscar valor no periodo
  async function buscarValorTotalPeriodo(){
    try {
      let dataDeInicio = new Date(dataInicio);
      let dataDeFim = new Date(dataFim);

      const valorTotalPeriodo = await api.get('transferencias/valorTotalPeriodo', {
        params: {
          dataInicio: dataDeInicio,
          dataFim: dataDeFim
        }
      });
      console.log(valorTotalPeriodo.data)
      setValorTotalPeriodo(valorTotalPeriodo.data);
    } catch (err) {
      alert('Não foi possível buscar os dados, verifique sua conexão!');
    }
  }

  //filtrar por NomeOperador E Periodo
  async function filtrarPorNomeOperadorEPeriodo(){
    try {
      let dataDeInicio = new Date(dataInicio);
      let dataDeFim = new Date(dataFim);

      const response = await api.get('transferencias', {
        params: {
          dataInicio: dataDeInicio,
          dataFim: dataDeFim,
          nomeOperador: nomeOperador.toUpperCase()
        }
      });
      
      setTransferencias(response.data);
    } catch (err) {
      alert('Não foi possível buscar os dados, verifique sua conexão!');
    }
  }

  //filtrar por periodo
  async function filtrarPorPeriodo() {
    try {
      let dataDeInicio = new Date(dataInicio);
      let dataDeFim = new Date(dataFim);

      const response = await api.get('transferencias', {
        params: {
          dataInicio: dataDeInicio,
          dataFim: dataDeFim
        }
      });
    
      setTransferencias(response.data);
    } catch (err) {
      alert('Não foi possível buscar os dados, verifique sua conexão!');
    }
  }

  //filtrar por operador
  async function filtrarPorOperador() {
    try{
      const response = await api.get('transferencias', {
        params: {
          nomeOperador: nomeOperador.toUpperCase()
        }
      });
      setValorTotalPeriodo("");
      setTransferencias(response.data);
    }catch(err){
      alert('Não foi possível buscar os dados, verifique sua conexão!');
    }
  }
  
  //função pra manipular o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(nomeOperador && (dataInicio && !dataFim)){
      alert('Por favor, preencha todas as datas.');
      return;
    } else if(nomeOperador && (!dataInicio && dataFim)){
      alert('Por favor, preencha todas as datas.');
      return;
    }

    if(nomeOperador && (!dataInicio && !dataFim)){
      filtrarPorOperador();
    } else if(nomeOperador && (!dataInicio || !dataFim)){
      filtrarPorOperador();
    } else if(nomeOperador && (dataInicio || dataFim)){
      buscarValorTotalPeriodo();
      filtrarPorNomeOperadorEPeriodo();
    } else if(dataInicio && dataFim) {
      buscarValorTotalPeriodo();
      filtrarPorPeriodo();
    } else if(nomeOperador) {
      filtrarPorOperador();
    } else if(dataInicio && !dataFim){
      alert('Por favor, preencha todas as datas.');
      return;
    } else if(!dataInicio && dataFim){
      alert('Por favor, preencha todas as datas.');
      return;
    } else {
      try{
        const response = await api.get('transferencias');
        setTransferencias(response.data);
        setValorTotalPeriodo("");
      }catch(err){
        alert('Não foi possível buscar os dados, verifique sua conexão!');
      }
    };
    
    buscarValorTotal();
  };

  return (
    <div>
      <section>
        <form onSubmit={handleSubmit}>
          <div>
            <div className='divLado'>
              <span>Data de Início: </span>
              <input className='input' type='date' value={dataInicio} 
              onChange={(e) => setDataInicio(e.target.value)}/>
            </div>
            
            <div className='divLado'>
              <span>Data de Fim: </span>
              <input className='input' type='date' value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}/>
            </div>
            
            <div className='divLado'>
              <span>Nome do operador transacionado: </span>
              <input className='input' type='text' value={nomeOperador}
              onChange={(e) => setNomeOperador(e.target.value)}/>
            </div>
            

          </div>
        </form>
      </section>

      <section>
        <div>
          <button onClick={handleSubmit} type='button'>Pesquisar</button>
        </div>
      </section>

      <section>
        <div>
          <span>Saldo total: R$ </span>
          <label>{valorTotal}</label>
          <span> Saldo no período: R$ </span>
          <label>{valorTotalPeriodo}</label>
        </div>
      </section>

      <section>
        <table>
          <thead>
            <tr>
              <th>Dados</th>
              <th>Valencia</th>
              <th>Tipo</th>
              <th>Nome do operador transacionado</th>
            </tr>
          </thead>
          <tbody>
            {transferencias && transferencias.map((transferencia) => (
              <tr key={transferencia.id}>
                <td>{transferencia.data_transferencia}</td>
                <td>{'R$ ' + transferencia.valor}</td>
                <td>{transferencia.tipo}</td>
                <td>{transferencia.nome_operador_transacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}