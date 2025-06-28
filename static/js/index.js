const app = () => {
  const socket = io('http://localhost:3000');
  const msgInput = document.querySelector('.message-input');
  const msgList = document.querySelector('.message-list');
  const sendBtn = document.querySelector('.send-btn');
  const userNameInput = document.querySelector('.username-input');

  const message = [];

  const getMessages = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/chat');
      renderMessages(data);
      data.forEach((item) => {
        message.push(item);
      });
    } catch (e) {}
  };
  getMessages();

  const renderMessages = (data) => {
    let messages = '';

    data.forEach((item) => {
      messages += `<li class="bg-dark p-2 rounded mb-2 d-flex justify-content-between message">
        <div class="mr-2">
          <span class="text-info">${item.username}</span>
          <p class="text-light">${item.text}</p>
        </div>
        <span class="text-muted text-right date">
          ${new Date(item.createdAt).toLocaleString('ru', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}        </span>
        </li>
      `;
    });
    msgList.innerHTML = messages;
  };
  const sendMessage = (data) => {
    socket.emit('sendMessage', data);
  };

  socket.on('recMessage', (item) => {
    message.push(item);
    renderMessages(message);
  });

  const handleSendMessage = (text) => {
    if (!text.trim()) {
      return;
    }

    sendMessage({
      username: userNameInput.value || 'Anonimus',
      text,
      createdAt: new Date(),
    });

    msgInput.value = '';
  };

  msgInput.addEventListener('keydown', (e) => {
    e.keyCode === 13 && handleSendMessage(e.target.value);
  });

  sendBtn.addEventListener('click', () => {
    handleSendMessage(msgInput.value);
  });
};

app();
