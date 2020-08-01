#!/usr/bin/env node


"use strict";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const {askChoices,choices,askTaskName,askTaskLists,askMsg} = require("./questions");
const clear = require("clear");
const chalk= require('chalk');
const figlet = require('figlet');

let client;

function createGRPCConnectionClient(){
    const packDef = protoLoader.loadSync("todo.proto",{});
    const grpcObject = grpc.loadPackageDefinition(packDef);
    const todoPackage = grpcObject.todoPackage;
    client = new todoPackage.Todo("localhost:40000",grpc.credentials.createInsecure());
}

async function addTodo(){
    // UNARY
    const task = await askTaskName();
    client.createTodo({
        "text": task.task
    },(err,res)=>{
        console.log("[Added Task]",res);
    });
}

async function addMultipleTodos(){
    // CLIENT STREAMING
    const tasks = await askTaskLists();
    const multipleText = tasks.tasks.split(',');
    console.log('[sending streams of data to server...]');
    const call = client.createMultipleTodos((err,res)=>{
        if(err){
            console.log("error",err);
        }
        console.log("response",res);
    });
    multipleText.forEach(item=>{
        console.log("[sending]=>",item);
        call.write({"text":item});
    });
    call.end();
    console.log('[stream closed]')
}

async function getEcho(){
    // Bidirectional Streaming 

    const call = client.echo();
    const clientmsg = await askMsg();
    call.write({"text":clientmsg.msg});
    call.on('data',async (msg)=>{
        console.log("[server]:",msg.text);
        const clientmsg = await askMsg();
        call.write({"text":clientmsg.msg});
    });
    call.on("end",()=>{
        call.end();
        console.log("[Bidirectional stream closed]");
    });
}

function getTodosList(){
     // SERVER STREAMING
    const call = client.readTodosStream();
    console.log('[receiving data streams from server...]');
    call.on('data',(msg)=>{
        console.log("[received]=>",msg);
    });
    call.on("end",_=>{
        console.log('[stream closed by server]');
    });
}

async function main(){
    const choice = await askChoices();
    createGRPCConnectionClient();
    switch(choice.choice){
        case choices.ADD_TASK:
            addTodo();
            break;
        case choices.ADD_MULTIPLE_TASK:
            addMultipleTodos();
            break;
        case choices.GET_LIST:
            getTodosList();
            break;
        case choices.ECHO:
            getEcho();
            break;
        default:
            break;
    }
}

if(require.main===module){
    clear(); // clears the console
    console.log(chalk.yellow(
        figlet.textSync('TODO APP',{horizontalLayout:'full'})
    ));
    main();
}

