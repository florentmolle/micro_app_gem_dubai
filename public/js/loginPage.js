/*********************************************** LOGIN PAGE *************************************************/

const login_button = document.getElementById('login_button');
login_button.addEventListener('click', askForAuthentification);

function askForAuthentification()
{
      // login_button
      const user_input = document.getElementById('user_input');
      const password_input = document.getElementById('password_input');


      fetch('/auth', {
            method: "POST",
            headers: 
            {
                  'Content-Type': 'application/json',
            },
            body: JSON.stringify(
            {
                  username: user_input.value,
                  password: password_input.value,
            }),
      })
      .then(res => res.json())
      .then(data => {
            if (data.authenticated) 
            {
                  window.location.href = '/home';
            } 
            else 
            {
                  console.log('Authentication failed');
            }
      })
      .catch(err => console.log('Error tryin to auth : ', err));

}