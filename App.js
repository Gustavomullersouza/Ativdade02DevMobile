import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';

export default function App() {

  const [marcas, setMarcas] = useState([]);
  const [marcasFiltradas, setMarcasFiltradas] = useState([]);
  const [buscaMarca, setBuscaMarca] = useState("");

  const [modelos, setModelos] = useState([]);
  const [modelosFiltrados, setModelosFiltrados] = useState([]);
  const [buscaModelo, setBuscaModelo] = useState("");

  const [anos, setAnos] = useState([]);
  const [carro, setCarro] = useState(null);

  const [marcaSelecionada, setMarcaSelecionada] = useState(null);
  const [modeloSelecionado, setModeloSelecionado] = useState(null);

  const [etapa, setEtapa] = useState("marca");

  const buscarMarcas = async () => {
    const resposta = await fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas');
    const dados = await resposta.json();
    setMarcas(dados);
    setMarcasFiltradas(dados);
  };

  const filtrarMarcas = (texto) => {
    setBuscaMarca(texto);

    const resultado = marcas.filter((item) =>
      item.nome.toLowerCase().includes(texto.toLowerCase())
    );

    setMarcasFiltradas(resultado);
  };

  const filtrarModelos = (texto) => {

    setBuscaModelo(texto);

    const resultado = modelos.filter((item) =>
      item.nome.toLowerCase().includes(texto.toLowerCase())
    );

    setModelosFiltrados(resultado);
  };

  const buscarModelos = async (codigoMarca) => {

    const resposta = await fetch(
      `https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigoMarca}/modelos`
    );

    const dados = await resposta.json();

    setModelos(dados.modelos);
    setModelosFiltrados(dados.modelos);
    setEtapa("modelo");
  };

  const buscarAnos = async (codigoModelo) => {

    const resposta = await fetch(
      `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelecionada}/modelos/${codigoModelo}/anos`
    );

    const dados = await resposta.json();
    setAnos(dados);
    setEtapa("ano");
  };

  const buscarPreco = async (codigoAno) => {

    const resposta = await fetch(
      `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelecionada}/modelos/${modeloSelecionado}/anos/${codigoAno}`
    );

    const dados = await resposta.json();
    setCarro(dados);
    setEtapa("preco");
  };

  const voltar = () => {

    if (etapa === "modelo") {
      setEtapa("marca");
    }

    else if (etapa === "ano") {
      setEtapa("modelo");
    }

    else if (etapa === "preco") {
      setEtapa("ano");
    }

  };

  useEffect(() => {
    buscarMarcas();
  }, []);

  return (

    <View style={styles.container}>

      {etapa !== "marca" && (
        <TouchableOpacity style={styles.botaoVoltar} onPress={voltar}>
          <Text style={styles.textoVoltar}>⬅ Voltar</Text>
        </TouchableOpacity>
      )}

      {etapa === "marca" && (
        <>
          <Text style={styles.titulo}>🚗 Escolha a Marca</Text>

          <TextInput
            style={styles.input}
            placeholder="Buscar marca..."
            value={buscaMarca}
            onChangeText={filtrarMarcas}
          />

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

      {etapa === "modelo" && (
        <>
          <Text style={styles.titulo}>🚙 Escolha o Modelo</Text>

          <TextInput
            style={styles.input}
            placeholder="Buscar modelo..."
            value={buscaModelo}
            onChangeText={filtrarModelos}
          />

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

      {etapa === "preco" && carro && (

        <View style={styles.resultado}>

          <Text style={styles.tituloResultado}>🚘 Resultado FIPE</Text>

          <Text style={styles.info}>Marca: {carro.Marca}</Text>
          <Text style={styles.info}>Modelo: {carro.Modelo}</Text>
          <Text style={styles.info}>Ano: {carro.AnoModelo}</Text>
          <Text style={styles.info}>Combustível: {carro.Combustivel}</Text>

          <Text style={styles.preco}>💰 {carro.Valor}</Text>

        </View>

      )}

      <StatusBar style="auto" />

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 15,
    backgroundColor: '#eef2f7'
  },

  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },

  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc'
  },

  botao: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center'
  },

  textoBotao: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },

  botaoVoltar: {
    backgroundColor: '#ef4444',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'flex-start'
  },

  textoVoltar: {
    color: 'white',
    fontWeight: 'bold'
  },

  resultado: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12
  },

  tituloResultado: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },

  info: {
    fontSize: 16,
    marginBottom: 5
  },

  preco: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#16a34a',
    marginTop: 10
  }

});