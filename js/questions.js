/* Conteúdo e imagens: Curricularização da Extensão 2026.docx.
 * A resposta correta é compartilhada pelos três níveis.
 * Cada lista abaixo contém somente os distratores daquele nível. */
const QUESTION_CONTENT = [
  ["Que animal aparece na imagem?", "Cachorro", "Animais", "O cachorro é um animal que pode ser nosso companheiro!", ["Avião"], ["Gato", "Coelho"], ["Lobo", "Raposa", "Gato"]],
  ["Qual é a cor da bola?", "Vermelha", "Cores", "A bola da imagem é vermelha!", ["Azul"], ["Amarela", "Verde"], ["Laranja", "Rosa", "Roxa"]],
  ["Quantas maçãs aparecem na imagem?", "3", "Números", "Vamos contar: uma, duas, três maçãs!", ["1"], ["2", "5"], ["2", "4", "6"]],
  ["Qual destes animais vive na água?", "Peixe", "Animais", "O peixe vive na água e nada com suas nadadeiras.", ["Elefante"], ["Gato", "Galinha"], ["Borboleta", "Passarinho", "Lagartixa"]],
  ["O que está em cima da mesa?", "Bola", "Posições", "A bola está em cima da mesa.", ["Avião"], ["Sapato", "Cadeira"], ["Prato", "Copo", "Maçã"]],
  ["Que letra aparece na imagem?", "A", "Letras", "Esta é a letra A, de abelha e de amizade!", ["O"], ["B", "C"], ["H", "V", "R"]],
  ["Qual animal da imagem é maior?", "Elefante", "Tamanhos", "O elefante é muito maior que a formiga!", ["Formiga"], ["Os dois são iguais", "Nenhum dos dois"], ["A formiga", "Os dois são pequenos", "Os dois são iguais"]],
  ["Que animal aparece nas árvores?", "Macaco", "Animais", "Os macacos da imagem estão brincando nas árvores!", ["Tubarão"], ["Pinguim", "Cachorro"], ["Esquilo", "Preguiça", "Coala"]],
  ["Qual palavra combina com a imagem?", "CASA", "Letras", "CASA é o nome da construção que aparece na imagem.", ["SOL"], ["BOLA", "GATO"], ["CAMA", "CAPA", "CAIXA"]],
  ["O que está embaixo da cadeira?", "Uma bola", "Posições", "A bola está embaixo da cadeira, pertinho dos pés dela!", ["Um avião"], ["Uma flor", "Um pássaro"], ["Um sapato", "Uma caixa", "Uma almofada"]],
  ["Qual grupo tem mais bolas?", "O grupo com 5 bolas", "Números", "Cinco é mais que três. O grupo da direita tem mais bolas!", ["O grupo sem bolas"], ["O grupo com 3 bolas", "Os dois têm a mesma quantidade"], ["O grupo da esquerda", "Os dois têm 3 bolas", "Os dois têm 5 bolas"]],
  ["Quantos animais aparecem na imagem?", "4", "Números", "São quatro cachorrinhos! Conte cada um com calma.", ["1"], ["2", "6"], ["3", "5", "7"]],
  ["Qual animal pode morar nesse lugar?", "Peixe", "Natureza", "Esse lugar fica debaixo da água. É um lar para os peixes!", ["Galinha"], ["Leão", "Macaco"], ["Cavalo", "Coruja", "Tartaruga terrestre"]],
  ["Qual palavra começa com a mesma letra de BOLA?", "Bolo", "Letras", "BOLA e BOLO começam com a letra B!", ["Sol"], ["Gato", "Casa"], ["Pato", "Dado", "Cola"]],
  ["Qual bola continua a sequência?", "Bola azul", "Sequências", "Vermelha, azul, vermelha… agora vem a azul!", ["Bola verde"], ["Bola vermelha", "Bola amarela"], ["Bola rosa", "Bola roxa", "Bola laranja"]],
  ["Qual figura tem um formato diferente?", "Quadrado", "Formas", "Os círculos são redondos. O quadrado tem quatro lados!", ["Círculo"], ["Primeiro círculo", "Segundo círculo"], ["Círculo da esquerda", "Círculo do meio", "Círculo perto do quadrado"]],
  ["Que palavra está escrita nas letras?", "CASA", "Letras", "C, A, S, A: juntando as letras, lemos CASA!", ["SOL"], ["BOLA", "GATO"], ["CASACO", "CAMA", "CAPA"]],
  ["Qual figura continua a sequência?", "Círculo", "Sequências", "Círculo, quadrado, círculo, quadrado… agora é círculo!", ["Estrela"], ["Quadrado", "Coração"], ["Triângulo", "Retângulo", "Losango"]],
  ["Qual grupo tem mais estrelas?", "Grupo A", "Números", "O grupo A tem 6 estrelas e o B tem 4. Seis é mais que quatro!", ["O grupo sem estrelas"], ["Grupo B", "Os dois são iguais"], ["Grupo B", "Os dois têm 6", "Os dois têm 4"]],
  ["Onde está o pássaro na imagem?", "O pássaro está em cima da árvore", "Posições", "O pássaro está em cima da árvore. O cachorro está embaixo!", ["Dentro de uma caixa"], ["Embaixo da árvore", "Dentro da casa"], ["Atrás do cachorro", "Embaixo da árvore", "Ao lado do tronco"]]
];

window.QUIZ_QUESTIONS = QUESTION_CONTENT.map(([texto, correta, tema, explicacao, facil, medio, dificil], index) => ({
  id: index + 1,
  texto, correta, tema, explicacao,
  imagem: `assets/images/pergunta-${String(index + 1).padStart(2, "0")}.png`,
  alternativas: {
    facil: [correta, ...facil],
    medio: [correta, ...medio],
    dificil: [correta, ...dificil]
  }
}));
