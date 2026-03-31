import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

export default function App() {

  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [anos, setAnos] = useState([]);
  const [carro, setCarro] = useState(null);

  const [marcaSelecionada, setMarcaSelecionada] = useState(null);
  const [modeloSelecionado, setModeloSelecionado] = useState(null);

  const [etapa, setEtapa] = useState("marca");

  // BUSCAR MARCAS
  const buscarMarcas = async () => {
    const resposta = await fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas');
    const dados = await resposta.json();
    setMarcas(dados);
  };

  // BUSCAR MODELOS
  const buscarModelos = async (codigoMarca) => {
    const resposta = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigoMarca}/modelos`);
    const dados = await resposta.json();
    setModelos(dados.modelos);
    setEtapa("modelo");
  };

  // BUSCAR ANOS
  const buscarAnos = async (codigoModelo) => {
    const resposta = await fetch(
      `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelecionada}/modelos/${codigoModelo}/anos`
    );
    const dados = await resposta.json();
    setAnos(dados);
    setEtapa("ano");
  };

  // BUSCAR PREÇO
  const buscarPreco = async (codigoAno) => {
    const resposta = await fetch(
      `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelecionada}/modelos/${modeloSelecionado}/anos/${codigoAno}`
    );

    const dados = await resposta.json();
    setCarro(dados);
    setEtapa("preco");
  };

  useEffect(() => {
    buscarMarcas();
  }, []);

  return (
    <View style={styles.container}>

      {etapa === "marca" && (
        <>
          <Text style={styles.titulo}>Escolha a Marca</Text>
          <FlatList
            data={marcas}
            keyExtractor={(item) => item.codigo}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  setMarcaSelecionada(item.codigo);
                  buscarModelos(item.codigo);
                }}
              >
                <Text>{item.nome}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {etapa === "modelo" && (
        <>
          <Text style={styles.titulo}>Escolha o Modelo</Text>
          <FlatList
            data={modelos}
            keyExtractor={(item) => item.codigo.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  setModeloSelecionado(item.codigo);
                  buscarAnos(item.codigo);
                }}
              >
                <Text>{item.nome}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {etapa === "ano" && (
        <>
          <Text style={styles.titulo}>Escolha o Ano</Text>
          <FlatList
            data={anos}
            keyExtractor={(item) => item.codigo}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => buscarPreco(item.codigo)}
              >
                <Text>{item.nome}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {etapa === "preco" && carro && (
        <View style={styles.card}>
          <Text style={styles.titulo}>Resultado</Text>
          <Text>Marca: {carro.Marca}</Text>
          <Text>Modelo: {carro.Modelo}</Text>
          <Text>Ano: {carro.AnoModelo}</Text>
          <Text>Combustível: {carro.Combustivel}</Text>
          <Text style={styles.preco}>Preço FIPE: {carro.Valor}</Text>
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
    paddingHorizontal: 10
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    marginBottom: 10,
    borderRadius: 5
  },
  preco: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 18
  }
});