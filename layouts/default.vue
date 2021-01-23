<template>
  <div>
    <Nuxt />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');

html {
  font-family: 'Noto Sans', sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

a {
  color: black;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.bodyWrapper {
  width: 100%;
  flex: 1 1;
}

.content {
  margin-top: 30px;
  width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.padding1 {
  padding: 10px;
}

.listItem {
  display: block;
  text-decoration: none;
  color: black;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

.listItem:hover {
  opacity: 0.8;
}

.flexGrow {
  flex: 1 1;
}

.flexCenter {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.flexRowSpaceAround {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.flexRowAlignRight {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.flexRowAlignLeft {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

button {
  display: inline-block;
  padding: 10px 30px;
  background: white;
  border-radius: 5px;
  border: 1px solid #ccc;
  transition: all 0.1s;
}

button:hover {
  opacity: 0.8;
  cursor: pointer;
}

button:focus {
  outline: 0;
}

input {
  padding: 5px;
  font-size: 12pt;
  border-radius: 5px;
  outline: none;
  border: 1px solid #ccc;
}

button, input, select, textarea {
  font-family : inherit;
}

.formBlock {
  margin-bottom: 15px;
}

.formLabel {
  display: block;
  font-size: 10pt;
  font-weight: 600;
}

.formInput {
  display: block;
  padding: 5px;
  font-size: 12pt;
  width: 100%;
  border-radius: 5px;
  outline: none;
  border: 1px solid #ccc;
}

.formInput:focus {
  border: 2px solid #0086c3;
}

.importantButton {
  background: #0086c3;
  color: white;
  border: 1px solid #0086c3;
}

.modalBase {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  z-index: 100;
  transition: all 1s;
}
</style>
