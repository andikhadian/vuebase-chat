<template>
<div class="view login" v-if="!state.passcode">
  <form class="login-form" @submit.prevent="Login">
    <div class="form-inner">
      <h1>Login to join the Group's</h1>
      <label for="passcode">Passcode</label>
      <input v-model="inputPasscode" type="password" name="" id="" placeholder="Enter the passcode...">
      <p v-if="state.notification" for="passcode">{{state.notification}}</p>
      <input type="submit" value="Login">
    </div>
  </form>
</div>
<div class="view login" v-else-if="(state.username === '' || state.username === null) && state.passcode">
  <form class="login-form" @submit.prevent="AddUsername">
    <div class="form-inner">
      <h1>Setting up your profile</h1>
      <label for="username">Name</label>
      <input type="text" v-model="inputUsername" placeholder="Enter your username...">
      <input type="submit" value="Join the chat">
    </div>
  </form>
</div>
<div v-else class="view chat">
  <header>
    <h1>Welcome, {{ state.username }}</h1>
  </header>
  <section class="chat-box">
    <div v-for="message in state.messages" :key="message.id" :class="(message.username === state.username ? 'message current-user' : 'message')">
      <div class="message-inner">
        <div class="username">{{message.username}}</div>
        <div class="content">{{message.content}}</div>
      </div>
    </div>
  </section>
  <footer>
    <form @submit.prevent="SendMessage">
      <input type="text" v-model="inputMessage" placeholder="Write a message...">
      <input type="submit" value="Send it">
    </form>
  </footer>
  <button class="logout" @click.prevent="() => state.username = ''">Logout</button>
</div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import db from './db'
export default {
  name: 'App',
  setup() {
    const inputPasscode = ref('')
    const inputUsername = ref('')
    const inputMessage = ref('')
    const messagesRef = db.database().ref("messages")

    const state = reactive({
      passcode: '',
      username: '',
      messages: [],
      notification: ''
    })

    const Login = () => {
      console.log(inputPasscode.value)
      if (inputPasscode.value !== "" || inputPasscode.value !== null) {
        if (inputPasscode.value !== '123') {
          state.notification = 'WRONG PASSCODE'
        } else {
          state.passcode = inputPasscode.value
          inputPasscode.value = ""
        }
      }
    }

    const AddUsername = () => {
      if (inputUsername.value !== "" || inputUsername.value !== null) {
        state.username = inputUsername.value
        inputUsername.value = ""
      }
    }

    const SendMessage = () => {

      if (inputMessage.value === "" || inputMessage.value === null) {
        return;
      }

      const message = {
        username: state.username,
        content: inputMessage.value,
      }

      messagesRef.push(message)
      inputMessage.value = ''
    }

    const DestroyNotification =() => {
      if (state.notification) {
        const timeout = setTimeout(() => {
          state.notification = ''
        }, 500)
        return timeout
      }
    }

    onMounted(() => {
      messagesRef.on('value', snapshot => {
        const data = snapshot.val()
        let messages = []

        Object.keys(data).forEach(el => {
          messages.push({
            id: el,
            username: data[el].username,
            content: data[el].content,
          })
        })
        
        state.messages = messages
      })
    })

    return {
      state,
      inputPasscode,
      inputUsername,
      inputMessage,
      Login,
      AddUsername,
      SendMessage,
      DestroyNotification,
    }
  }
}
</script>

<style lang="scss">
* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.view {
  overflow: hidden;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background-color: #00b761;
  padding: 24px;

  &.login {
    align-items: center;
    .login-form {
      display: block;
      width: 100%;
      padding: 15px;

      .form-inner {
        display: block;
        background-color: #fff;
        padding: 50px 40px;
        border-radius: 16px;
        box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
        h1 {
          color: #aaa;
          font-size: 28px;
          margin-bottom: 28px;
        }
        p {
          text-align: center;
          color: #00b761;
          font-size: 1rem;
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          color: #aaa;
          font-size: 16px;
          transition: 0.4s;
        }
        input[type="text"],
        input[type="password"] {
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          width: 100%;
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 15px;

          color: #333;
          font-size: 18px;
          box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
          background-color: #f3f3f3;
          transition: 0.4s;
          &::placeholder {
            color: #888;
            transition: 0.4s;
          }
        }
        input[type="submit"] {
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          width: 100%;
          padding: 10px 15px;
          background-color: #00b761;
          border-radius: 8px;
          color: #fff;
          font-size: 18px;
          font-weight: 700;
        }
        &:focus-within {
          label {
            color: #00b761;
          }
          input[type="text"] {
            background-color: #fff;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
            &::placeholder {
              color: #666;
            }
          }
        }
      }
    }
  }
  &.chat {
    flex-direction: column;
    .logout {
      // right: 15px;
      appearance: none;
      border: none;
      outline: none;
      background: none;
      color: #fff;
      font-size: 18px;
      margin-bottom: 10px;
      margin-top: 20px;
      text-align: center;
    }
    header {
      position: relative;
      display: block;
      width: 100%;
      padding: 5px 30px 10px;
      h1 {
        color: #fff;
        margin-bottom: 20px;
        text-align: center;
      }
    }
    .chat-box {
      max-height: 420px;
      border-radius: 24px 24px 0px 0px;
      background-color: #fff;
      box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
      flex: 1 1 100%;
      padding: 30px;
      overflow-y: auto;
      .message {
        display: flex;
        margin-bottom: 15px;

        .message-inner {
          .username {
            color: #888;
            font-size: 16px;
            margin-bottom: 5px;
            padding-left: 15px;
            padding-right: 15px;
          }
          .content {
            display: inline-block;
            padding: 10px 20px;
            background-color: #f3f3f3;
            border-radius: 999px;
            color: #333;
            font-size: 18px;
            line-height: 1.2em;
            text-align: left;
          }
        }
        &.current-user {
          margin-top: 30px;
          justify-content: flex-end;
          text-align: right;
          .message-inner {
            max-width: 75%;
            .content {
              color: #fff;
              font-weight: 600;
              background-color: #00b761;
            }
          }
        }
      }
    }
    footer {
      position: sticky;
      bottom: 0px;
      background-color: #fff;
      border-radius: 0 0 24px 24px;
      padding: 30px;
      box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
      form {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        input[type="text"] {
          flex: 1 1 100%;
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          // margin-right: 20px;
          padding: 15px 15px;
          border-radius: 100px;

          color: #333;
          font-size: 18px;
          box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
          background-color: #f3f3f3;
          transition: 0.4s;
          &::placeholder {
            color: #888;
            transition: 0.4s;
            text-align: center;
          }
        }

        input[type="submit"] {
          margin-top: 16px;
          height: 48px;
          width: 100%;
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          padding: 7px 15px;
          border-radius: 100px;
          background-color: #00b761;
          color: #fff;
          font-size: 18px;
          font-weight: 700;
        }
      }
    }
  }
}
</style>