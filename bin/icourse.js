#!/usr/bin/env node --harmony
process.env.NODE_PATH = __dirname + '/../node_modules/'
const program = require('commander');
const download = require('download-git-repo');
const inqurirer = require('inquirer');
const handlebars = require('handlebars');
const ora = require('ora');

const chalk = require('chalk');
const fs = require('fs');
const symbols = require('log-symbols');
program.version('1.0.6', '-v, --version')
    .command('init <name>')
    .action((name) => {
 
        const fileName = `${name}/package.json`;
        inqurirer.prompt([
            {
                name:"description",
                message:'请输入项目描述'
            },
            {
                name:"author",
                message:'请输入作者名称'
            }
        ]).then((answers)=>{
            if(fs.existsSync(fileName)){
                console.log(symbols.error,chalk.red('项目已存在'));
                return;
            }
            const spinner = ora('正在下载应用模板');
            spinner.start();
           
            download('https://gitee.com:dreamcolt/xes-template#master',name,{clone:true},(err)=>{
                if(err){
                    spinner.fail();
                    console.log(symbols.error,chalk.red(err));
                }else{
                    spinner.succeed();

                    const meta = {
                        name,
                        description:answers.description,
                        author:answers.author,
                   
                    }
                 
                    const content = fs.readFileSync(fileName).toString();
                    const result = handlebars.compile(content)(meta);
                    fs.writeFileSync(fileName,result);
             
                    console.log(symbols.success,chalk.green('项目初始化完成'));
                }
            })
        })
    });
program.parse(process.argv);