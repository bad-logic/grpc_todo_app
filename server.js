#!/usr/bin/env node 

"use strict";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const store = [];

// unary
function createTodo(call,callback){ // call=> req, callback=>res
    const todoItem = {
        "id":store.length,
        "text":call.request.text
    }
    store.push(todoItem);
    callback(null,todoItem);
}

// client streaming
function createMultipleTodos(call,callback){
    let count = 0;
    call.on('data',msg=>{
        count++;
        const todoItem = {
            "id":store.length,
            "text":msg.text
        }
        store.push(todoItem);
    });
    call.on("end",()=>{
        callback(null,{added:true,count});
    });
}

// server streaming
function readTodosStream(call,callback){
    store.forEach(item=>{
        call.write(item);
    });
    call.end();
}

// Bidirectional Streaming 
function echo(call,callback){
    call.on('data',msg=>{
        call.write({"text":msg.text});
    });
    call.on('end',()=>{
        call.end();
    });
}

function getPackage(){
    const packDef = protoLoader.loadSync("todo.proto",{});
    const grpcObject = grpc.loadPackageDefinition(packDef);
    return grpcObject.todoPackage;
}

function setupServer(){
    const todoPackage = getPackage();
    const server =  new grpc.Server();
    // grpc uses http/2 which needs to be secure
    // using grpc allows you to by pass it
    server.bind("localhost:40000", grpc.ServerCredentials.createInsecure());
    server.addService(todoPackage.Todo.service,{
        "createTodo": createTodo,
        "readTodosStream":readTodosStream,
        "createMultipleTodos":createMultipleTodos,
        "echo":echo
    });
    server.start();
}

function main(){

   setupServer();

}

if(require.main===module){
    main();
}