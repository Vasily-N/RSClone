const btn = document.getElementById('reg-user') as HTMLButtonElement;
const btnAuth = document.getElementById('auth-user') as HTMLButtonElement;
const userName = document.getElementById('user') as HTMLInputElement;
const userPass = document.getElementById('password') as HTMLInputElement;

interface IUser {
  name: string,
  password: string,
}

function makeData() {
  const data = {
    name: userName.value,
    password: userPass.value,
  };
  console.log(data);
  return data;
}

async function postData(user: IUser) {
  try {
    const req = await fetch('http://127.0.0.1:5000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const res = await req.json();
  } catch (error) {
    console.log(error);
  }
}

async function getData() {
  try {
    const req = await fetch('http://127.0.0.1:5000/api/users');
    const res = await req.json();
    console.log(res);
    const clientData = makeData();
    for (let i = 0; i < res.length; i += 1) {
      if (res[i].name === clientData.name && res[i].password === clientData.password) {
        return console.log(`glad to see you again, ${clientData.name}`);
      }
    }
    return console.log('you entered the wrong username or password');
  } catch (error) {
    console.log(error);
  }
}

function regUser() {
  postData(makeData());
}

function authUser() {
  getData();
}

btn.addEventListener('click', regUser);
btnAuth.addEventListener('click', getData);
