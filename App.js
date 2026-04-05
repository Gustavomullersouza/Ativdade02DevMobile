// Importa o componente StatusBar da biblioteca Expo
// Ele permite controlar a aparência da barra superior do celular
import { StatusBar } from 'expo-status-bar';

// Importa dois hooks do React:
// useState -> cria variáveis de estado
// useEffect -> executa funções em momentos específicos do ciclo de vida
import { useEffect, useState } from 'react';

// Importa componentes visuais do React Native
// StyleSheet -> cria estilos
// Text -> exibe texto
// View -> container semelhante a uma div
// FlatList -> lista otimizada para muitos itens
// TouchableOpacity -> botão clicável
// TextInput -> campo de digitação
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';


// Componente principal da aplicação
// Todo aplicativo React Native começa por um componente principal
export default function App() {
  
  // ESTADOS DA APLICAÇÃO
  
  // Guarda TODAS as marcas vindas da API
  const [marcas, setMarcas] = useState([]);

  // Guarda apenas as marcas filtradas pela busca
  const [marcasFiltradas, setMarcasFiltradas] = useState([]);

  // Guarda o texto digitado no campo de busca da marca
  const [buscaMarca, setBuscaMarca] = useState("");

  // Guarda todos os modelos da marca escolhida
  const [modelos, setModelos] = useState([]);

  // Guarda os modelos filtrados pela busca
  const [modelosFiltrados, setModelosFiltrados] = useState([]);

  // Guarda o texto digitado na busca de modelo
  const [buscaModelo, setBuscaModelo] = useState("");

  // Guarda os anos disponíveis de um modelo
  const [anos, setAnos] = useState([]);

  // Guarda os dados finais do carro (valor FIPE, combustível, etc)
  const [carro, setCarro] = useState(null);

  // Guarda o código da marca selecionada
  const [marcaSelecionada, setMarcaSelecionada] = useState(null);

  // Guarda o código do modelo selecionado
  const [modeloSelecionado, setModeloSelecionado] = useState(null);

  // Controla em qual etapa da aplicação o usuário está
  // marca -> escolher marca
  // modelo -> escolher modelo
  // ano -> escolher ano
  // preco -> mostrar resultado
  const [etapa, setEtapa] = useState("marca");

  // FUNÇÕES DE BUSCA NA API

  // Função responsável por buscar todas as marcas na API FIPE
  const buscarMarcas = async () => {

    // Faz uma requisição HTTP para a API
    const resposta = await fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas');

    // Converte a resposta para JSON
    const dados = await resposta.json();

    // Salva todas as marcas no estado principal
    setMarcas(dados);

    // Também salva na lista filtrada (inicialmente sem filtro)
    setMarcasFiltradas(dados);
  };

  // FILTRO DE MARCAS
 
  // Esta função executa sempre que o usuário digita na busca
  const filtrarMarcas = (texto) => {

    // Atualiza o estado do campo de busca
    setBuscaMarca(texto);

    // Filtra as marcas que contém o texto digitado
    const resultado = marcas.filter((item) =>
      item.nome.toLowerCase().includes(texto.toLowerCase())
    );

    // Atualiza a lista exibida na tela
    setMarcasFiltradas(resultado);
  };
 
  // FILTRO DE MODELOS

  // Mesma lógica usada na busca de marcas
  const filtrarModelos = (texto) => {

    // Atualiza o campo digitado
    setBuscaModelo(texto);

    // Filtra os modelos pelo nome
    const resultado = modelos.filter((item) =>
      item.nome.toLowerCase().includes(texto.toLowerCase())
    );

    // Atualiza a lista de modelos exibida
    setModelosFiltrados(resultado);
  };

  // BUSCAR MODELOS DA MARCA

  // Esta função é chamada quando o usuário clica em uma marca
  const buscarModelos = async (codigoMarca) => {

    // Faz requisição usando o código da marca
    const resposta = await fetch(
      `https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigoMarca}/modelos`
    );

    // Converte para JSON
    const dados = await resposta.json();

    // Salva todos os modelos da marca
    setModelos(dados.modelos);

    // Salva também como lista filtrada
    setModelosFiltrados(dados.modelos);

    // Muda a etapa da aplicação para escolha de modelo
    setEtapa("modelo");
  };

  // BUSCAR ANOS DO MODELO

  // Esta função executa quando o usuário escolhe um modelo
  const buscarAnos = async (codigoModelo) => {

    // Faz requisição passando marca e modelo
    const resposta = await fetch(
      `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelecionada}/modelos/${codigoModelo}/anos`
    );

    // Converte resposta para JSON
    const dados = await resposta.json();

    // Salva os anos disponíveis
    setAnos(dados);

    // Muda para etapa de escolha do ano
    setEtapa("ano");
  };

  // BUSCAR PREÇO FIPE

  // Executa quando o usuário seleciona o ano
  const buscarPreco = async (codigoAno) => {

    // Requisição final da API FIPE
    const resposta = await fetch(
      `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelecionada}/modelos/${modeloSelecionado}/anos/${codigoAno}`
    );

    // Converte a resposta em JSON
    const dados = await resposta.json();

    // Salva os dados do carro
    setCarro(dados);

    // Muda para a etapa de mostrar o preço
    setEtapa("preco");
  };

  // BOTÃO VOLTAR

  const voltar = () => {

    // Se estiver na tela de modelos, volta para marcas
    if (etapa === "modelo") {
      setEtapa("marca");
    }

    // Se estiver nos anos, volta para modelos
    else if (etapa === "ano") {
      setEtapa("modelo");
    }

    // Se estiver no resultado, volta para anos
    else if (etapa === "preco") {
      setEtapa("ano");
    }
  };

  // useEffect

  // Este hook executa apenas uma vez
  // quando o aplicativo inicia
  useEffect(() => {

    // Busca todas as marcas da API
    buscarMarcas();

  }, []);

  // INTERFACE DA APLICAÇÃO

  return (

    // Container principal da aplicação
    <View style={styles.container}>

      {/* Botão voltar aparece apenas se não estiver na primeira etapa */}
      {etapa !== "marca" && (
        <TouchableOpacity style={styles.botaoVoltar} onPress={voltar}>
          <Text style={styles.textoVoltar}>⬅ Voltar</Text>
        </TouchableOpacity>
      )}

      {/* =============================
          TELA DE MARCAS
      ============================= */}

      {etapa === "marca" && (
        <>
          <Text style={styles.titulo}>🚗 Escolha a Marca</Text>

          {/* Campo de busca de marca */}
          <TextInput
            style={styles.input}
            placeholder="Buscar marca..."
            value={buscaMarca}
            onChangeText={filtrarMarcas}
          />

          {/* Lista de marcas */}
          <FlatList
            data={marcasFiltradas}
            keyExtractor={(item) => item.codigo}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.botao}
                onPress={() => {
                  setMarcaSelecionada(item.codigo);
                  buscarModelos(item.codigo);
                }}
              >
                <Text style={styles.textoBotao}>{item.nome}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}


      {/* =============================
          TELA DE MODELOS
      ============================= */}

      {etapa === "modelo" && (
        <>
          <Text style={styles.titulo}>🚙 Escolha o Modelo</Text>

          {/* Campo de busca de modelo */}
          <TextInput
            style={styles.input}
            placeholder="Buscar modelo..."
            value={buscaModelo}
            onChangeText={filtrarModelos}
          />

          {/* Lista de modelos */}
          <FlatList
            data={modelosFiltrados}
            keyExtractor={(item) => item.codigo.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.botao}
                onPress={() => {
                  setModeloSelecionado(item.codigo);
                  buscarAnos(item.codigo);
                }}
              >
                <Text style={styles.textoBotao}>{item.nome}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}


      {/* =============================
          TELA DE ANOS
      ============================= */}

      {etapa === "ano" && (
        <>
          <Text style={styles.titulo}>📅 Escolha o Ano</Text>

          <FlatList
            data={anos}
            keyExtractor={(item) => item.codigo}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.botao}
                onPress={() => buscarPreco(item.codigo)}
              >
                <Text style={styles.textoBotao}>{item.nome}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}


      {/* =============================
          TELA DE RESULTADO
      ============================= */}

      {etapa === "preco" && carro && (

        <View style={styles.resultado}>

          <Text style={styles.tituloResultado}>🚘 Resultado FIPE</Text>

          <Text style={styles.info}>Marca: {carro.Marca}</Text>
          <Text style={styles.info}>Modelo: {carro.Modelo}</Text>
          <Text style={styles.info}>Ano: {carro.AnoModelo}</Text>
          <Text style={styles.info}>Combustível: {carro.Combustivel}</Text>

          {/* Valor do veículo segundo a tabela FIPE */}
          <Text style={styles.preco}>💰 {carro.Valor}</Text>

        </View>

      )}

      {/* Barra de status do celular */}
      <StatusBar style="auto" />

    </View>
  );
}
// Estilos da aplicação
const styles = StyleSheet.create({

  // Container principal
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 15,
    backgroundColor: '#eef2f7'
  },

  // Título das telas
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },

  // Campo de busca
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc'
  },

  // Botões da lista
  botao: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center'
  },

  // Texto dentro do botão
  textoBotao: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },

  // Botão voltar
  botaoVoltar: {
    backgroundColor: '#ef4444',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'flex-start'
  },

  // Texto do botão voltar
  textoVoltar: {
    color: 'white',
    fontWeight: 'bold'
  },

  // Caixa do resultado
  resultado: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12
  },

  // Título do resultado
  tituloResultado: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },

  // Informações do carro
  info: {
    fontSize: 16,
    marginBottom: 5
  },

  // Preço FIPE
  preco: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#16a34a',
    marginTop: 10
  }

});