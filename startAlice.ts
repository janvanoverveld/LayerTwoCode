import { receiveMessageServer } from "./receiveMessageServer";
import { ADD, BYE, RES } from "./Message";
import { sendMessage } from "./sendMessage";
import { roles, initialize } from "./globalObjects";
import { messageDB } from "./messageDB";

const value: ()=>number = ()=>Math.floor(Math.random() * 5);

async function executeProtocol(role:roles,port:number,host:string) {
   await initialize(role,port,host);
   for(let i=0;i<5;i++) {
      const add = new ADD(value(),value());
      await sendMessage(roles.alice, roles.bob, add);
      const msg = <RES> await messageDB.remove(
         m => (m.name === RES.name && m.from === roles.bob)
      );
      if (msg)
        console.log(`Received a ${msg.name} with ${msg.sum}.`);
   }
   await sendMessage(roles.alice, roles.bob, new BYE() );
   receiveMessageServer.terminate();
}

async function start(){
   await executeProtocol(roles.alice,30001,'localhost');
}

start();