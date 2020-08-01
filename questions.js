

"use strict";

const choices = {
    ADD_TASK:"Add Task",
    ADD_MULTIPLE_TASK:"Add Multiple Task",
    GET_LIST:"Get List of Tasks",
    ECHO:"Chat with server"
}

const inquirer = require('inquirer');

module.exports = Object.freeze({
    choices:choices,
    askChoices : ()=>{
        const questions = [
            {
                name:'choice',
                type:'list',
                message:'what do you want to do:',
                choices:[choices.ADD_TASK,choices.ADD_MULTIPLE_TASK,choices.GET_LIST,choices.ECHO],
                default:choices.ADD_MULTIPLE_TASK
            }
        ];
        return inquirer.prompt(questions);
    },
    askTaskName: ()=>{
        const questions = [
            {
                name:'task',
                type:'input',
                message:'Enter Task Name:',
                validate: function( value ) {
                    if (value.length) {
                      return true;
                    } else {
                      return 'Please Enter Task Name:';
                    }
                }
            }
        ];
        return inquirer.prompt(questions);
    },
    askTaskLists: ()=>{
        const questions = [
            {
                name:'tasks',
                type:'input',
                message:'Enter List of Tasks Seperated by comma (,):',
                validate: function( value ) {
                    if (value.length) {
                      return true;
                    } else {
                      return 'Please Enter Task Name:';
                    }
                }
            }
        ];
        return inquirer.prompt(questions);
    },
    askMsg: ()=>{
        const questions = [
            {
                name:'msg',
                type:'input',
                message:'[ME]:',
                validate: function( value ) {
                    if (value.length) {
                      return true;
                    } else {
                      return '[ME]:';
                    }
                }
            }
        ];
        return inquirer.prompt(questions);
    }
});