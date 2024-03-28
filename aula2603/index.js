const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const { parse } = require('path')

operation()

function operation(){
    inquirer.prompt([
        {
            type:'list',
            name:'action',
            message: 'O que você deseja fazer?',
            choices:[
                'Criar conta',
                'Consultar saldo',
                'Depositar',
                'Sacar',
                'Sair'
            ]
        }
    ]).then((answer) => {
        const action = answer['action']

        if(action === 'Criar conta'){
            createAccount()
        }else if(action === 'Consultar saldo'){
            getAccountBalance()
        }else if(action === 'Depositar'){
            deposit()
        }else if(action === 'Sacar'){
            withdraw()
        }else if(action === 'Sair'){
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts Node!'))
            process.exit()
        }
    })
}

function createAccount(){
    console.log(chalk.bgGreen.white('Obrigado por utilizar o Accounts Node Bank!'))
    console.log(chalk.green('Vamos criar sua conta agora...'))

    buildAccount()
}

function buildAccount(){
    inquirer.prompt([
        {
            name:'accountName',
            message: 'Entre com nome da sua conta: '
        }
    ]).then((anwser) => {
        const accountName = anwser['accountName']

        if(accountName === ""){
            console.error('Não é permitido contas com nome vazio')
            operation()
        }

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.error(chalk.bgRed.black(`A conta: ${accountName} já existe!`))
            console.error(chalk.red('Escolha outro nome: '))

            buildAccount(accountName)
        }

        fs.writeFileSync(
            `accounts/${accountName}.json`,
            `{"balance":0}`,
            function(err){
                console.error(err)
            }
        )
        console.info(chalk.bgGreen.white(`Sua conta: ${accountName} foi cria parabéns!`))
        console.info(chalk.green('Pode começar a opera-la!'))

        operation()
    })
}

function deposit() {
    inquire.prompt([
        {
            name: 'accountName',
            message: 'Qual conta deseja depositar: '
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message:'Quanto deseja depositar: '
            }
        ]).then((anwser) => {
            const amount = anwser['amount']

            addAmount(accountName, amount)
            operation()
        })
    })
}

function checkAccount(accountName) {
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.error(chalk.bgRed.white(`A conta: ${accountName} não existe.`))
        return false
    }

    return true
}

function addAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){
        console.error(chalk.bgRed.white('Ocorreu um erro na operação, volte mais tarde!'))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.error(err)
        }
    )

    console.info(chalk.bgYellowBright.black(`O Valor: ${amount} depositado na conta : ${accountName}`))
}

function getAccount(accountName){
    const accountJson = fs.readFileSync(`accounts/${accountName}.json`,
    {
        encoding: 'utf-8',
        flag: 'r'
    })

    return JSON.parse(accountJson)
}