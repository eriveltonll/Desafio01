var inputName = null;
let nomePesquisar = null;
let tabUsuariosEncontrados = null;

let allUsuarios = [];
let UsuariosPesquisados = [];
let totalSexoMasculino = 0;
let totalSexoFeminino = 0;

let totalSomaDasIdades = 0;
let totalMediaDasIdades = 0;

let countUsuariosEncontrados = 0;
let buttonBuscar = null;

let numberFormat = null;
let estatistica = 0;

window.addEventListener('load', () => {
  inputName = document.querySelector('#inputName');
  tabUsuariosEncontrados = document.querySelector('#tabUsuariosEncontrados');
  totalSexoMasculino = document.querySelector('#totalSexoMasculino');
  totalSexoFeminino = document.querySelector('#totalSexoFeminino');

  totalSomaDasIdades = document.querySelector('#totalSomaDasIdades');
  totalMediaDasIdades = document.querySelector('#totalMediaDasIdades');

  countUsuariosEncontrados = document.querySelector(
    '#countUsuariosEncontrados'
  );
  numberFormat = Intl.NumberFormat('pt-BR');

  buttonBuscar = document.querySelector('#buttonBuscar');
  estatistica = document.querySelector('#estatistica');
  preventFormSubmit();
  activeInput();
  fetchUsuarios();
});

function preventFormSubmit() {
  function handleFormSubmit(event) {
    event.preventDefault();
  }

  var form = document.querySelector('form');
  form.addEventListener('submit', handleFormSubmit);
}

function activeInput() {
  function insertName(newName) {
    nomePesquisar = newName;
    consultaUsuario();
    render();
  }
  function handleTyping(event) {
    var hasText = !!event.target.value && event.target.value.trim() !== '';

    if (!hasText) {
      clearInput();
      buttonBuscar.disabled = true;
      return;
    }
    if (hasText) {
      buttonBuscar.disabled = false;
    }

    if (event.key === 'Enter') {
      insertName(event.target.value);
      clearInput();
      buttonBuscar.disabled = true;
    }
  }

  function clickButton(event) {
    let inputNovoName = document.querySelector('#inputName');
    insertName(inputNovoName.value);
    clearInput();
    buttonBuscar.disabled = true;
  }
  inputName.focus();
  inputName.addEventListener('keyup', handleTyping);
  buttonBuscar.addEventListener('click', clickButton);
}

function clearInput() {
  inputName.value = '';
  inputName.focus();
}

async function fetchUsuarios() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();
  allUsuarios = json;
  allUsuarios = json.results.map((user) => {
    const { gender, name, dob, picture } = user;
    return {
      gender: gender,
      firstlast: name.first + ' ' + name.last,
      age: dob.age,
      thumbnail: picture.thumbnail,
    };
  });

  allUsuarios.sort((a, b) => {
    return a.firstlast.localeCompare(b.firstlast);
  });
}

function render() {
  renderUserList();
  renderCalcEstatisticas();
}

function renderUserList() {
  let usuariosHTML = '<div>';
  UsuariosPesquisados.forEach((user) => {
    const { gender, firstlast, age, thumbnail } = user;

    const userHTML = `
    <div class = 'user'>
      <div>
      <img src="${thumbnail}">
      </div>
      <div>
      <span id ="texto">${firstlast}, </span>
      </div>
      <div>
      <span id ="texto">${age} anos</span>
      </div>
    </div>
    `;
    usuariosHTML += userHTML;
  });
  tabUsuariosEncontrados.innerHTML = usuariosHTML;
}

function renderCalcEstatisticas() {
  const countUsuariosEncontradostemp = UsuariosPesquisados.length;

  const idadetotal = UsuariosPesquisados.reduce((acc, cur) => {
    return acc + cur.age;
  }, 0);

  totalSomaDasIdades.textContent = 'Soma das idades: ' + idadetotal;

  if (countUsuariosEncontradostemp !== 0) {
    totalMediaDasIdades.textContent =
      'Média das idades: ' +
      formatNumber(idadetotal / countUsuariosEncontradostemp);
  } else totalMediaDasIdades.textContent = 'Média das idades: ' + '0';
  const AtotalSexoMasculino = UsuariosPesquisados.filter((user) => {
    return user.gender === 'male';
  });

  totalSexoMasculino.textContent =
    'Sexo Masculino: ' + AtotalSexoMasculino.length;

  const AtotalSexoFeminino = UsuariosPesquisados.filter((user) => {
    return user.gender === 'female';
  });
  totalSexoFeminino.textContent = 'Sexo Feminino: ' + AtotalSexoFeminino.length;

  countUsuariosEncontrados.textContent =
    '(' + UsuariosPesquisados.length + ') usuário(s) encontrado(s)';

  estatistica.textContent = 'Estatísticas';
}

function consultaUsuario() {
  const RetornoUsuarios = allUsuarios.filter((user) => {
    return user.firstlast.toUpperCase().includes(nomePesquisar.toUpperCase());
  });
  UsuariosPesquisados = RetornoUsuarios;
}

function formatNumber(number) {
  return numberFormat.format(number);
}
