import { receiveMessageServer } from "./receiveMessageServer";
import { ADD, BYE, RES, Message } from "./Message";
import { sendMessage } from "./sendMessage";
import { roles, initialize } from "./globalObjects";
import { messageDB } from "./messageDB";

async function executeProtocol( role:roles, port:number, host:string) {
   await initialize(role, port, host);
   while ( true ){
      const msg = await messageDB.remove(
         m => (m.name === ADD.name && m.from === roles.alice)
           || (m.name === BYE.name && m.from === roles.alice)
      );
      switch (msg.name) {
         case ADD.name: {
            const add = <ADD> msg;
            console.log(`ADD with ${add.value1} and ${add.value2}.`);
            const res = new RES( add.value1 + add.value2 );
            await sendMessage(roles.bob, roles.alice, res);
            break;
         }
         case BYE.name:{
            receiveMessageServer.terminate();
            return new Promise( resolve => resolve() );
         }
      }
   }
}

async function start(){
   await executeProtocol(roles.bob,30002,'localhost');
}

start();