// index.js
const { Client, GatewayIntentBits ,Collection} = require('discord.js');
const fs = require('fs');
require('dotenv').config();

/*Instanciar bot*/
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,                 // Para detectar servidores
        GatewayIntentBits.GuildMessages,          // Para leer mensajes en canales
        GatewayIntentBits.MessageContent          // Para acceder al contenido de los mensajes
    ]
});

/*Coleccion para almacenar comandos*/
client.commands = new Collection();
/*Cargan todos los comandos de la carpeta*/
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Función para leer el JSON
const loadData = () => JSON.parse(fs.readFileSync('./incidencias.json', 'utf-8'));

// Función para guardar el JSON
const saveData = (data) => {
    fs.writeFileSync('./incidencias.json', JSON.stringify(data, null, 2));
};

client.once('ready', () => {
    console.log(`🤖 ¡Bot conectado como ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
    /*Salir si los mensajes son del bot o no tienen prefijo*/
    if(message.author.bot || !message.content.startsWith('!')){
        return ;
    }else{
        // Dividir el mensaje en comando y argumentos
        const args = message.content.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Buscar el comando en la colección
        const command = client.commands.get(commandName);
        if (!command){ 
            if(message.content.startsWith('!') && message.content === '!bot'){
                message.reply('Hola soy un bot que les ayudara a mantener registros. \n Puedes escribir los siguientes comandos: \n -1. `!bot` \n -2. `!insert nombre:usuario motivo:example` \n -3. `!select`');
            }else{
                message.reply('No has ejecutado ningun comando para mi o algun mensaje');
            }
            
            return;
        }

        // Ejecutar el comando
        try {
            command.execute(message, args, loadData, saveData);
        } catch (error) {
            console.error('Error al ejecutar el comando:', error);
            message.reply('❌ ¡Ocurrió un error al ejecutar el comando!');
        }
    }
});

client.login(process.env.TOKEN);
