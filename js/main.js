'use strict';

(async () => {
  const ul = document.querySelector('ul');
  const rfrsh = document.querySelector('#refresh');
  const form = document.querySelector('form');
  const username = prompt('Enter username');
  const greeting = form.elements.greeting;
  console.log('hello');

  if('serviceWorker' in navigator){
    try{
      await navigator.serviceWorker.register('./sw.js');
      const swRegistration = await navigator.serviceWorker.ready;
      if('sync' in swRegistration) {
        form.addEventListener('submit', async (event)=>{
          event.preventDefault();
          const message = {
            username,
            greeting: greeting.value,
          };

          const ready = await saveData('outbox', message);
          ready && (await swRegistration.sync.register('send-message'));
        });
      }
    }catch(error){
      console.log('sw', error);
    }
  }

  const init = async () => {
    const data = [];
    try {
      const greetings = await getGreetingsByUser(username);
       for (const message of greetings) {
        data.push(message);
      }
    }
    catch (e) {
      console.log(e.message);
    }

    ul.innerHTML = '';
    data.forEach(item => {
      ul.innerHTML += `<ul>${item.username}: ${item.greeting}</ul>`;
    });
  };

  init();

  rfrsh.addEventListener('click', init);
})();
